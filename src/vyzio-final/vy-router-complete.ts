// src/server/routers/vy.ts — VERSIÓN COMPLETA con RAG
// Reemplaza al router anterior

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import {
  vyChat,
  evaluateProject,
  getWeakTopics,
  getNextRecommendedLesson,
} from "@/lib/vy-system";

const VY_DAILY_LIMITS: Record<string, number> = {
  STARTER: 10,
  PRO: 9999,
  PREMIUM: 9999,
  FAMILY: 9999,
  SCHOOL: 9999,
  ENTERPRISE: 9999,
};

export const vyRouter = createTRPCRouter({

  // ── Chat principal con RAG ────────────────────────────────
  chat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(1000),
      currentLessonId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      const plan   = ctx.user!.subscription?.plan ?? "STARTER";
      const limit  = VY_DAILY_LIMITS[plan] ?? 10;

      // Check daily limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await ctx.prisma.vyMessage.count({
        where: { userId, role: "user", createdAt: { gte: today } },
      });

      if (todayCount >= limit) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Límite de ${limit} mensajes diarios alcanzado. Actualiza a Pro para mensajes ilimitados.`,
        });
      }

      // Get conversation history (last 10 pairs)
      const history = await ctx.prisma.vyMessage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { role: true, content: true },
      });

      // Store user message
      await ctx.prisma.vyMessage.create({
        data: { userId, role: "user", content: input.message },
      });

      // Call VY with full context
      const result = await vyChat({
        prisma: ctx.prisma,
        userId,
        message: input.message,
        history: history.reverse().map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        currentLessonId: input.currentLessonId,
        plan,
      });

      // Store assistant response
      await ctx.prisma.vyMessage.create({
        data: {
          userId,
          role: "assistant",
          content: result.message,
          tokens: result.tokensUsed,
        },
      });

      return {
        message: result.message,
        retrievedContext: result.retrievedContext,
        weakTopics: result.weakTopicsDetected,
        messagesUsedToday: todayCount + 1,
        messagesLimit: limit,
        isUnlimited: plan !== "STARTER",
      };
    }),

  // ── Diagnóstico de debilidades ────────────────────────────
  getWeaknesses: protectedProcedure.query(async ({ ctx }) => {
    const weakTopics = await getWeakTopics(ctx.prisma, ctx.user!.id);

    if (weakTopics.length === 0) {
      return { hasWeaknesses: false, topics: [], message: null };
    }

    // Generate VY advice for weaknesses
    const topicList = weakTopics.join(", ");
    const advice = await vyChat({
      prisma: ctx.prisma,
      userId: ctx.user!.id,
      message: `Genera un plan de 3 pasos concretos para mejorar en: ${topicList}. Máximo 100 palabras, tono de VY.`,
      history: [],
      plan: ctx.user!.subscription?.plan ?? "STARTER",
    });

    return {
      hasWeaknesses: true,
      topics: weakTopics,
      message: advice.message,
    };
  }),

  // ── Recomendación personalizada ──────────────────────────
  getRecommendation: protectedProcedure.query(async ({ ctx }) => {
    const [nextLesson, weakTopics] = await Promise.all([
      getNextRecommendedLesson(ctx.prisma, ctx.user!.id),
      getWeakTopics(ctx.prisma, ctx.user!.id),
    ]);

    return {
      nextLesson: nextLesson ? {
        id: nextLesson.id,
        title: nextLesson.title,
        worldName: nextLesson.world.name,
        durationMin: nextLesson.durationMin,
        xpReward: nextLesson.xpReward,
      } : null,
      weakTopics,
      hasPriorityReview: weakTopics.length > 0,
    };
  }),

  // ── Evaluar proyecto ─────────────────────────────────────
  evaluateProject: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
      projectDescription: z.string().min(20).max(2000),
      projectUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: { world: { include: { level: true } } },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });

      const evaluation = await evaluateProject(
        lesson.title,
        lesson.world.level.name,
        lesson.world.name,
        input.projectDescription,
        input.projectUrl
      );

      return { evaluation, lessonTitle: lesson.title };
    }),

  // ── Generar quiz extra ────────────────────────────────────
  generateExtraQuiz: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: { quizQuestions: true },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });

      const existingQuestions = lesson.quizQuestions
        .map(q => q.question)
        .slice(0, 3)
        .join("\n- ");

      const result = await vyChat({
        prisma: ctx.prisma,
        userId: ctx.user!.id,
        message: `Genera 2 preguntas nuevas de quiz sobre "${lesson.title}". Que sean diferentes a estas: ${existingQuestions}. Formato JSON: [{"question": "...", "options": ["A","B","C","D"], "correctIndex": N, "explanation": "..."}]`,
        history: [],
        plan: ctx.user!.subscription?.plan ?? "STARTER",
      });

      try {
        const json = result.message.match(/\[[\s\S]+\]/)?.[0];
        if (!json) throw new Error("No JSON found");
        return { questions: JSON.parse(json) };
      } catch {
        return { questions: [] };
      }
    }),

  // ── Historial de conversación ────────────────────────────
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.vyMessage.findMany({
        where: { userId: ctx.user!.id },
        orderBy: { createdAt: "asc" },
        take: input.limit,
      });
    }),

  // ── Uso diario ───────────────────────────────────────────
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const plan  = ctx.user!.subscription?.plan ?? "STARTER";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await ctx.prisma.vyMessage.count({
      where: { userId: ctx.user!.id, role: "user", createdAt: { gte: today } },
    });

    return {
      used: count,
      limit: VY_DAILY_LIMITS[plan] ?? 10,
      isUnlimited: plan !== "STARTER",
    };
  }),

  // ── Limpiar historial ────────────────────────────────────
  clearHistory: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.vyMessage.deleteMany({ where: { userId: ctx.user!.id } });
    return { success: true };
  }),
});
