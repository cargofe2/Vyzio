// src/server/routers/user.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({

  // ── Register new user (called after Clerk webhook) ───────
  register: publicProcedure
    .input(z.object({
      clerkId: z.string(),
      email: z.string().email(),
      displayName: z.string(),
      username: z.string(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.user.findUnique({
        where: { clerkId: input.clerkId },
      });
      if (existing) return existing;

      const user = await ctx.prisma.user.create({
        data: {
          ...input,
          gamification: { create: {} },
          subscription: { create: { plan: "STARTER" } },
        },
        include: { gamification: true, subscription: true },
      });

      return user;
    }),

  // ── Get own profile ──────────────────────────────────────
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.user!.id },
      include: {
        gamification: true,
        subscription: true,
        _count: {
          select: {
            lessonProgress: { where: { completed: true } },
            portfolioItems: true,
            certificates: true,
          },
        },
      },
    });
  }),

  // ── Public profile by username ───────────────────────────
  getProfile: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { username: input.username },
        include: {
          gamification: {
            select: { xpTotal: true, rank: true, rankLevel: true, streakMax: true, lessonsCompleted: true },
          },
          certificates: { orderBy: { issuedAt: "desc" } },
          portfolioItems: {
            where: { isPublic: true },
            orderBy: { createdAt: "desc" },
            take: 12,
          },
          achievements: {
            include: { achievement: true },
            orderBy: { earnedAt: "desc" },
          },
        },
      });
      if (!user || !user.isPublicProfile) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
    }),

  // ── Update profile ───────────────────────────────────────
  updateProfile: protectedProcedure
    .input(z.object({
      displayName: z.string().min(2).max(50).optional(),
      bio: z.string().max(160).optional(),
      avatarEmoji: z.string().max(4).optional(),
      isPublicProfile: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.user!.id },
        data: input,
      });
    }),

  // ── Get achievements (with earned status) ───────────────
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const [all, earned] = await Promise.all([
      ctx.prisma.achievement.findMany({ orderBy: { triggerValue: "asc" } }),
      ctx.prisma.userAchievement.findMany({
        where: { userId: ctx.user!.id },
        include: { achievement: true },
      }),
    ]);
    const earnedIds = new Set(earned.map((e) => e.achievementId));
    return all.map((a) => ({
      ...a,
      earned: earnedIds.has(a.id),
      earnedAt: earned.find((e) => e.achievementId === a.id)?.earnedAt ?? null,
    }));
  }),
});
