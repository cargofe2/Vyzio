// src/server/routers/gamification.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { getRankFromXP, getXPToNextRank } from "@/lib/gamification";

export const gamificationRouter = createTRPCRouter({

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const g = await ctx.prisma.gamification.findUnique({
      where: { userId: ctx.user!.id },
    });
    if (!g) return null;
    return {
      ...g,
      rankProgress: getXPToNextRank(g.xpTotal),
    };
  }),

  getXPHistory: protectedProcedure
    .input(z.object({ days: z.number().int().min(1).max(30).default(7) }))
    .query(async ({ ctx, input }) => {
      const since = new Date();
      since.setDate(since.getDate() - input.days);
      const g = await ctx.prisma.gamification.findUnique({ where: { userId: ctx.user!.id } });
      if (!g) return [];
      return ctx.prisma.xpEvent.findMany({
        where: { gamificationId: g.id, createdAt: { gte: since } },
        orderBy: { createdAt: "asc" },
      });
    }),

  getMissions: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    return ctx.prisma.missionProgress.findMany({
      where: {
        userId: ctx.user!.id,
        mission: {
          isActive: true,
          OR: [{ endsAt: null }, { endsAt: { gte: now } }],
        },
      },
      include: { mission: true },
      orderBy: { mission: { type: "asc" } },
    });
  }),

  claimMissionReward: protectedProcedure
    .input(z.object({ missionProgressId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const mp = await ctx.prisma.missionProgress.findUnique({
        where: { id: input.missionProgressId },
        include: { mission: true },
      });
      if (!mp || mp.userId !== ctx.user!.id) return null;
      if (!mp.completed || mp.rewardClaimed) return null;

      await ctx.prisma.missionProgress.update({
        where: { id: input.missionProgressId },
        data: { rewardClaimed: true },
      });
      await ctx.prisma.gamification.update({
        where: { userId: ctx.user!.id },
        data: {
          xpTotal: { increment: mp.mission.xpReward },
          xpWeekly: { increment: mp.mission.xpReward },
          gems: { increment: mp.mission.gemReward },
          vyCoins: { increment: mp.mission.coinReward },
        },
      });
      return { xpReward: mp.mission.xpReward, gemReward: mp.mission.gemReward };
    }),
});
