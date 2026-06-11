// src/server/routers/progress.ts — Lesson completion + quiz submission
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { awardXP, XP_REWARDS, updateMissionProgress, hasEnoughEnergy, ENERGY_CONFIG } from "@/lib/gamification";

export const progressRouter = createTRPCRouter({
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;
    const [gamification, recentLessons, activeMissions] = await Promise.all([
      ctx.prisma.gamification.findUnique({ where: { userId } }),
      ctx.prisma.lessonProgress.findMany({ where: { userId, completed: true }, orderBy: { completedAt: "desc" }, take: 5, include: { lesson: { include: { world: { include: { level: true } } } } } }),
      ctx.prisma.missionProgress.findMany({ where: { userId, completed: false }, include: { mission: true }, take: 4 }),
    ]);
    return { gamification, recentLessons, activeMissions };
  }),
  recordVideoWatch: protectedProcedure.input(z.object({ lessonId: z.string(), watchPct: z.number().min(0).max(1) })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.lessonProgress.upsert({ where: { userId_lessonId: { userId: ctx.user!.id, lessonId: input.lessonId } }, create: { userId: ctx.user!.id, lessonId: input.lessonId, videoWatchPct: input.watchPct }, update: { videoWatchPct: input.watchPct } });
  }),
  submitQuizAnswer: protectedProcedure.input(z.object({ questionId: z.string(), selectedIndex: z.number().int().min(0).max(3), timeSpentSec: z.number().int().default(0) })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user!.id;
    const plan = ctx.user!.subscription?.plan ?? "STARTER";
    const gamification = await ctx.prisma.gamification.findUnique({ where: { userId } });
    if (!gamification) throw new TRPCError({ code: "NOT_FOUND" });
    if (!hasEnoughEnergy(gamification.energy, gamification.updatedAt, plan))
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Sin energía. Espera que se recargue o actualiza a Pro." });
    const question = await ctx.prisma.quizQuestion.findUnique({ where: { id: input.questionId } });
    if (!question) throw new TRPCError({ code: "NOT_FOUND" });
    const isCorrect = input.selectedIndex === question.correctIndex;
    const previousAttempt = await ctx.prisma.quizAttempt.findFirst({ where: { userId, questionId: input.questionId } });
    const isPerfect = isCorrect && !previousAttempt;
    await ctx.prisma.quizAttempt.create({ data: { userId, questionId: input.questionId, selectedIndex: input.selectedIndex, isCorrect, isPerfect, timeSpentSec: input.timeSpentSec } });
    if (plan === "STARTER") await ctx.prisma.gamification.update({ where: { userId }, data: { energy: { decrement: ENERGY_CONFIG.quizCost } } });
    const xpReason = isPerfect ? "quiz_perfect_first" : isCorrect ? "quiz_correct" : "quiz_consolation";
    const xpResult = await awardXP({ prisma: ctx.prisma, userId, gamification, baseXP: XP_REWARDS[xpReason], reason: xpReason, plan });
    if (isCorrect) { await updateMissionProgress({ prisma: ctx.prisma, userId, event: "quiz_correct" }); if (isPerfect) await updateMissionProgress({ prisma: ctx.prisma, userId, event: "quiz_perfect" }); }
    return { isCorrect, isPerfect, correctIndex: question.correctIndex, explanation: question.explanation, xpAwarded: xpResult.xpAwarded, newXPTotal: xpResult.newXPTotal, newRank: xpResult.newRank, rankChanged: xpResult.rankChanged, achievements: xpResult.achievements };
  }),
  completeLesson: protectedProcedure.input(z.object({ lessonId: z.string(), score: z.number().int().min(0).max(100).optional(), timeSpentSec: z.number().int().default(0) })).mutation(async ({ ctx, input }) => {
    const userId = ctx.user!.id;
    const plan = ctx.user!.subscription?.plan ?? "STARTER";
    const lesson = await ctx.prisma.lesson.findUnique({ where: { id: input.lessonId }, include: { world: { include: { level: true, _count: { select: { lessons: true } } } } } });
    if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
    const gamification = await ctx.prisma.gamification.findUnique({ where: { userId } });
    if (!gamification) throw new TRPCError({ code: "NOT_FOUND" });
    const existing = await ctx.prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId: input.lessonId } } });
    const alreadyCompleted = existing?.completed ?? false;
    if (!alreadyCompleted) {
      await ctx.prisma.lessonProgress.upsert({ where: { userId_lessonId: { userId, lessonId: input.lessonId } }, create: { userId, lessonId: input.lessonId, completed: true, completedAt: new Date(), score: input.score, timeSpentSec: input.timeSpentSec, xpEarned: lesson.xpReward }, update: { completed: true, completedAt: new Date(), score: input.score, xpEarned: lesson.xpReward } });
    }
    let xpResult = null;
    if (!alreadyCompleted) {
      xpResult = await awardXP({ prisma: ctx.prisma, userId, gamification, baseXP: lesson.xpReward, reason: "lesson_complete", plan });
      await updateMissionProgress({ prisma: ctx.prisma, userId, event: "lessons_today" });
      await updateMissionProgress({ prisma: ctx.prisma, userId, event: "lessons_completed" });
    }
    const completedCount = await ctx.prisma.lessonProgress.count({ where: { userId, lesson: { worldId: lesson.worldId }, completed: true } });
    const pct = lesson.world._count.lessons > 0 ? completedCount / lesson.world._count.lessons : 0;
    const worldCompleted = pct >= 1.0;
    await ctx.prisma.worldProgress.upsert({ where: { userId_worldId: { userId, worldId: lesson.worldId } }, create: { userId, worldId: lesson.worldId, pctComplete: pct, completed: worldCompleted, completedAt: worldCompleted ? new Date() : null }, update: { pctComplete: pct, completed: worldCompleted } });
    return { alreadyCompleted, xpResult, worldCompletion: { pctComplete: pct, worldCompleted } };
  }),
  getProgressOverview: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user!.id;
    const [levelProgress, achievements, certCount] = await Promise.all([
      ctx.prisma.worldProgress.findMany({ where: { userId }, include: { world: { include: { level: true } } } }),
      ctx.prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true }, orderBy: { earnedAt: "desc" } }),
      ctx.prisma.certificate.count({ where: { userId } }),
    ]);
    return { levelProgress, achievements, certCount };
  }),
});
