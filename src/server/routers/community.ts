// src/server/routers/community.ts
// Leaderboards (Redis), projects feed, teams

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { redis, LEADERBOARD_KEYS } from "@/lib/redis";

export const communityRouter = createTRPCRouter({

  // ── Global weekly leaderboard (Redis sorted set) ─────────
  getWeeklyLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }))
    .query(async ({ ctx, input }) => {
      // Top N from Redis sorted set (score = weekly XP)
      const topEntries = await redis.zrange(
        LEADERBOARD_KEYS.weekly,
        0,
        input.limit - 1,
        { rev: true, withScores: true }
      );

      if (!topEntries.length) return { entries: [], userRank: null };

      // Batch fetch user display info
      const userIds = topEntries
        .filter((_, i) => i % 2 === 0)
        .map(String);
      const scores = topEntries
        .filter((_, i) => i % 2 === 1)
        .map(Number);

      const users = await ctx.prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          displayName: true,
          username: true,
          avatarEmoji: true,
          gamification: { select: { rank: true, rankLevel: true } },
        },
      });

      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

      const entries = userIds.map((id, i) => ({
        rank: i + 1,
        userId: id,
        xpWeekly: scores[i] ?? 0,
        user: userMap[id] ?? null,
      }));

      // Get requesting user's rank if logged in
      let userRank = null;
      if (ctx.user) {
        const rank = await redis.zrank(LEADERBOARD_KEYS.weekly, ctx.user.id, {
          rev: true,
        });
        if (rank !== null) {
          const score = await redis.zscore(LEADERBOARD_KEYS.weekly, ctx.user.id);
          userRank = { rank: rank + 1, xpWeekly: score ?? 0 };
        }
      }

      return { entries, userRank };
    }),

  // ── Update user's leaderboard score (called after XP event) ─
  syncLeaderboard: protectedProcedure.mutation(async ({ ctx }) => {
    const gamification = await ctx.prisma.gamification.findUnique({
      where: { userId: ctx.user!.id },
    });
    if (!gamification) return;

    await redis.zadd(LEADERBOARD_KEYS.weekly, {
      score: gamification.xpWeekly,
      member: ctx.user!.id,
    });
    await redis.zadd(LEADERBOARD_KEYS.allTime, {
      score: gamification.xpTotal,
      member: ctx.user!.id,
    });
  }),

  // ── Public project feed ──────────────────────────────────
  getProjects: publicProcedure
    .input(z.object({
      cursor: z.string().optional(),
      limit: z.number().int().min(1).max(20).default(10),
      filter: z.enum(["all", "level1", "level2", "level3", "level4"]).default("all"),
    }))
    .query(async ({ ctx, input }) => {
      const levelFilter = input.filter !== "all"
        ? parseInt(input.filter.replace("level", ""))
        : undefined;

      const items = await ctx.prisma.portfolioItem.findMany({
        where: {
          isPublic: true,
          ...(levelFilter
            ? { lesson: { world: { level: { number: levelFilter } } } }
            : {}),
          ...(input.cursor ? { id: { lt: input.cursor } } : {}),
        },
        orderBy: [{ likeCount: "desc" }, { createdAt: "desc" }],
        take: input.limit + 1,
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              username: true,
              avatarEmoji: true,
              gamification: { select: { rank: true } },
            },
          },
          lesson: { include: { world: { include: { level: true } } } },
        },
      });

      const hasMore = items.length > input.limit;
      const data = hasMore ? items.slice(0, -1) : items;

      return {
        items: data,
        nextCursor: hasMore ? data[data.length - 1]?.id : undefined,
      };
    }),

  // ── Submit project to portfolio ──────────────────────────
  publishProject: protectedProcedure
    .input(z.object({
      title: z.string().min(3).max(100),
      description: z.string().min(20).max(500),
      projectType: z.string(),
      tools: z.array(z.string()).max(8),
      lessonId: z.string().optional(),
      projectUrl: z.string().url().optional(),
      thumbnailUrl: z.string().url().optional(),
      isPublic: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const plan = ctx.user!.subscription?.plan ?? "STARTER";
      if (plan === "STARTER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "El portafolio de proyectos requiere plan Pro.",
        });
      }

      const item = await ctx.prisma.portfolioItem.create({
        data: { userId: ctx.user!.id, ...input },
      });

      // Award XP for publishing
      const gamification = await ctx.prisma.gamification.findUnique({
        where: { userId: ctx.user!.id },
      });
      if (gamification) {
        const { awardXP } = await import("@/lib/gamification");
        await awardXP({
          prisma: ctx.prisma,
          userId: ctx.user!.id,
          gamification,
          baseXP: 150,
          reason: "project_published",
          meta: { portfolioItemId: item.id },
          plan,
        });
        // Sync leaderboard
        await redis.zincrby(LEADERBOARD_KEYS.weekly, 150, ctx.user!.id);
      }

      return item;
    }),

  // ── Like a project ───────────────────────────────────────
  likeProject: protectedProcedure
    .input(z.object({ portfolioItemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Simple like (no unlike in MVP — can add later)
      await ctx.prisma.portfolioItem.update({
        where: { id: input.portfolioItemId },
        data: { likeCount: { increment: 1 } },
      });
      return { success: true };
    }),

  // ── Teams ────────────────────────────────────────────────
  createTeam: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(30),
      description: z.string().max(200).optional(),
      emoji: z.string().max(4).default("⚡"),
    }))
    .mutation(async ({ ctx, input }) => {
      const slug = input.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 30);

      const team = await ctx.prisma.team.create({
        data: {
          ...input,
          slug: `${slug}-${Date.now()}`,
          creatorId: ctx.user!.id,
          members: {
            create: { userId: ctx.user!.id, role: "leader" },
          },
        },
      });
      return team;
    }),

  joinTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.findUnique({
        where: { id: input.teamId },
        include: { _count: { select: { members: true } } },
      });
      if (!team) throw new TRPCError({ code: "NOT_FOUND" });
      if (!team.isPublic) throw new TRPCError({ code: "FORBIDDEN" });
      if (team._count.members >= team.maxMembers) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Equipo lleno." });
      }

      await ctx.prisma.teamMember.create({
        data: { teamId: input.teamId, userId: ctx.user!.id },
      });
      return { success: true };
    }),

  getMyTeams: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.teamMember.findMany({
      where: { userId: ctx.user!.id },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    displayName: true,
                    avatarEmoji: true,
                    gamification: { select: { xpWeekly: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }),
});
