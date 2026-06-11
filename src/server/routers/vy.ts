// src/server/routers/vy.ts
// VY — Tutor Inteligente powered by Anthropic Claude API
// RAG over lesson content via Pinecone + user progress context

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

// Daily message limits per plan
const VY_LIMITS: Record<string, number> = {
  STARTER: 10,
  PRO: 9999,
  PREMIUM: 9999,
  FAMILY: 9999,
  SCHOOL: 9999,
  ENTERPRISE: 9999,
};

// VY system prompt — pedagogical personality
const VY_SYSTEM_PROMPT = `Eres VY, el tutor inteligente de VYZIO — la plataforma donde jóvenes aprenden Inteligencia Artificial.

PERSONALIDAD:
- Directo, entusiasta y sin condescendencia
- Tono de "el amigo más listo de la clase" — no de profesor aburrido
- Usas analogías concretas del mundo real (videojuegos, redes sociales, música)
- Celebras logros sin exagerar
- Nunca dices "gran pregunta" ni frases genéricas de chatbot

FORMATO:
- Máximo 150 palabras por respuesta (microaprendizaje)
- Usa negritas para términos clave
- Termina con una acción concreta cuando sea relevante: "¿Lo hacemos ahora?" o "Prueba esto:"
- Si hay código, muéstralo limpio con backticks

CAPACIDADES:
- Explicas conceptos de IA con analogías simples
- Evalúas respuestas y das feedback específico (no genérico)
- Propones proyectos calibrados al nivel del usuario
- Detectas confusiones y las corriges directamente
- Motivas sin ser cargante

LÍMITES:
- Solo hablas de IA, tecnología y el aprendizaje en VYZIO
- Si preguntan algo fuera del tema, reconduces amablemente
- Nunca inventas datos. Si no sabes algo exacto, lo dices.

CONTEXTO DEL USUARIO (inyectado dinámicamente):
{USER_CONTEXT}`;

export const vyRouter = createTRPCRouter({

  // ── Send message to VY ────────────────────────────────────
  chat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(1000),
      // optional context hints from client
      currentLessonId: z.string().optional(),
      currentWorldSlug: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user!.id;
      const plan = ctx.user!.subscription?.plan ?? "STARTER";
      const limit = VY_LIMITS[plan] ?? 10;

      // Check daily message count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const messageCount = await ctx.prisma.vyMessage.count({
        where: { userId, role: "user", createdAt: { gte: today } },
      });

      if (messageCount >= limit) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Alcanzaste el límite de ${limit} mensajes diarios. Actualiza a Pro para mensajes ilimitados.`,
        });
      }

      // Build user context for system prompt
      const [gamification, recentProgress, currentLesson] = await Promise.all([
        ctx.prisma.gamification.findUnique({ where: { userId } }),
        ctx.prisma.lessonProgress.findMany({
          where: { userId, completed: true },
          orderBy: { completedAt: "desc" },
          take: 3,
          include: { lesson: { include: { world: true } } },
        }),
        input.currentLessonId
          ? ctx.prisma.lesson.findUnique({
              where: { id: input.currentLessonId },
              include: { world: { include: { level: true } } },
            })
          : null,
      ]);

      const userContext = buildUserContext({
        user: ctx.user!,
        gamification,
        recentProgress,
        currentLesson,
      });

      // Get last 10 messages for conversation history
      const history = await ctx.prisma.vyMessage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20, // 10 pairs
      });

      const messages: Anthropic.MessageParam[] = [
        // Reverse to chronological order
        ...history
          .reverse()
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        { role: "user", content: input.message },
      ];

      // Store user message
      await ctx.prisma.vyMessage.create({
        data: { userId, role: "user", content: input.message },
      });

      // Call Claude
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        system: VY_SYSTEM_PROMPT.replace("{USER_CONTEXT}", userContext),
        messages,
      });

      const assistantContent =
        response.content[0].type === "text" ? response.content[0].text : "";

      // Store assistant response + token count
      await ctx.prisma.vyMessage.create({
        data: {
          userId,
          role: "assistant",
          content: assistantContent,
          tokens: response.usage.input_tokens + response.usage.output_tokens,
        },
      });

      return {
        message: assistantContent,
        messagesUsedToday: messageCount + 1,
        messagesLimit: limit,
      };
    }),

  // ── Get conversation history ─────────────────────────────
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.vyMessage.findMany({
        where: { userId: ctx.user!.id },
        orderBy: { createdAt: "asc" },
        take: input.limit,
      });
      return messages;
    }),

  // ── Clear conversation ───────────────────────────────────
  clearHistory: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.vyMessage.deleteMany({ where: { userId: ctx.user!.id } });
    return { success: true };
  }),

  // ── Get daily usage ──────────────────────────────────────
  getUsage: protectedProcedure.query(async ({ ctx }) => {
    const plan = ctx.user!.subscription?.plan ?? "STARTER";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await ctx.prisma.vyMessage.count({
      where: { userId: ctx.user!.id, role: "user", createdAt: { gte: today } },
    });

    return {
      used: count,
      limit: VY_LIMITS[plan] ?? 10,
      isUnlimited: plan !== "STARTER",
    };
  }),

  // ── Evaluate a project submission ───────────────────────
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

      const evaluationPrompt = `Evalúa este proyecto de un estudiante de VYZIO.

LECCIÓN: "${lesson.title}" (${lesson.world.level.name} · ${lesson.world.name})
DESCRIPCIÓN DEL PROYECTO:
${input.projectDescription}
${input.projectUrl ? `URL: ${input.projectUrl}` : ""}

Responde SOLO en este formato JSON:
{
  "score": <número 0-100>,
  "passed": <true si score >= 70>,
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "improvements": ["mejora 1", "mejora 2"],
  "feedback": "<párrafo de feedback motivador de máx 80 palabras>",
  "nextSteps": "<qué hacer después, máx 40 palabras>"
}`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: evaluationPrompt }],
      });

      const raw =
        response.content[0].type === "text" ? response.content[0].text : "{}";

      try {
        const evaluation = JSON.parse(raw.replace(/```json|```/g, "").trim());
        return { evaluation, lessonTitle: lesson.title };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al procesar la evaluación. Intenta de nuevo.",
        });
      }
    }),
});

// ─── Build context string for VY system prompt ───────────────
function buildUserContext({
  user,
  gamification,
  recentProgress,
  currentLesson,
}: {
  user: any;
  gamification: any;
  recentProgress: any[];
  currentLesson: any;
}): string {
  const lines = [
    `Nombre: ${user.displayName}`,
    `Rango: ${gamification?.rank ?? "NOVICE"} · Nivel ${gamification?.rankLevel ?? 1}`,
    `XP total: ${gamification?.xpTotal?.toLocaleString() ?? 0}`,
    `Racha: ${gamification?.streakDays ?? 0} días`,
    `Lecciones completadas: ${gamification?.lessonsCompleted ?? 0}`,
  ];

  if (currentLesson) {
    lines.push(
      `Lección actual: "${currentLesson.title}" (${currentLesson.world.level.name} · ${currentLesson.world.name})`
    );
  }

  if (recentProgress.length > 0) {
    lines.push(
      `Últimas lecciones completadas: ${recentProgress
        .map((p) => `"${p.lesson.title}"`)
        .join(", ")}`
    );
  }

  return lines.join("\n");
}
