import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PostSchema = z.object({
  lessonId: z.string().min(1).max(100),
  score: z.number().min(0).max(100).optional(),
  timeSpentSec: z.number().min(0).max(86400).optional(),
});

const PutSchema = z.object({
  questionId: z.string().min(1).max(100),
  selectedIndex: z.number().int().min(0).max(10),
  timeSpentSec: z.number().min(0).max(86400).optional(),
});

export const dynamic = "force-dynamic";

// Freno anti-ráfaga: 60 req/min por usuario, por instancia.
// NO es un límite distribuido — en serverless cada instancia lleva su propio contador.
// La protección real contra XP duplicado es el reclamo atómico de compleción (más abajo)
// y el chequeo de intento correcto previo en el PUT. Esto solo amortigua ráfagas.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clerkId: string): boolean {
  const now = Date.now();

  // Purga de entradas vencidas: sin esto el Map crece sin límite mientras viva la instancia.
  if (rateMap.size > 1000) {
    for (const [key, value] of rateMap) {
      if (now > value.resetAt) rateMap.delete(key);
    }
  }

  const entry = rateMap.get(clerkId);
  if (!entry || now > entry.resetAt) {
    rateMap.set(clerkId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

const RANKS = [
  { rank: "NOVICE", xp: 0 },
  { rank: "EXPLORER", xp: 500 },
  { rank: "CREATOR", xp: 2000 },
  { rank: "BUILDER", xp: 6000 },
  { rank: "INNOVATOR", xp: 15000 },
  { rank: "VISIONARY", xp: 30000 },
  { rank: "PIONEER", xp: 55000 },
  { rank: "MASTER", xp: 90000 },
  { rank: "LEGEND", xp: 140000 },
  { rank: "AI_TITAN", xp: 200000 },
];

function getRank(xp: number): string {
  let rank = "NOVICE";
  for (const r of RANKS) {
    if (xp >= r.xp) rank = r.rank;
  }
  return rank;
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!checkRateLimit(clerkId)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = PostSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    const { lessonId, score, timeSpentSec = 0 } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { gamification: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { world: { include: { _count: { select: { lessons: true } } } } },
    });

    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    // Reclamo atómico de la primera compleción.
    // Dos peticiones simultáneas ya no pueden otorgar XP dos veces: la base de datos
    // decide quién gana, no una lectura previa que ambas ven igual.
    let firstCompletion = false;
    try {
      await prisma.lessonProgress.create({
        data: {
          userId: user.id, lessonId, completed: true,
          completedAt: new Date(), score, timeSpentSec,
          xpEarned: lesson.xpReward,
        },
      });
      firstCompletion = true;
    } catch {
      // La fila ya existía (violación de índice único). Intentamos la transición false -> true.
      const claimed = await prisma.lessonProgress.updateMany({
        where: { userId: user.id, lessonId, completed: false },
        data: {
          completed: true, completedAt: new Date(), score, timeSpentSec,
          xpEarned: lesson.xpReward,
        },
      });
      firstCompletion = claimed.count === 1;

      // Ya estaba completada: refrescamos datos de sesión sin volver a pagar XP.
      if (!firstCompletion) {
        await prisma.lessonProgress.update({
          where: { userId_lessonId: { userId: user.id, lessonId } },
          data: { score, timeSpentSec },
        });
      }
    }

    const alreadyCompleted = !firstCompletion;

    let xpAwarded = 0;
    let newRank: string = user.gamification?.rank ?? "NOVICE";
    let rankChanged = false;

    if (firstCompletion && user.gamification) {
      xpAwarded = lesson.xpReward;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastStudy = user.gamification.lastStudyDate;
      const lastStudyDay = lastStudy ? new Date(lastStudy) : null;
      if (lastStudyDay) lastStudyDay.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const isNewDay = !lastStudyDay || lastStudyDay.getTime() !== today.getTime();
      let newStreak = user.gamification.streakDays;
      if (!lastStudyDay || lastStudyDay.getTime() < yesterday.getTime()) {
        newStreak = 1;
      } else if (lastStudyDay.getTime() === yesterday.getTime()) {
        newStreak += 1;
      }

      let streakBonus = 0;
      if (isNewDay) {
        if (newStreak === 3) streakBonus = 50;
        else if (newStreak === 7) streakBonus = 150;
        else if (newStreak === 14) streakBonus = 300;
        else if (newStreak === 30) streakBonus = 750;
        else if (newStreak > 30 && newStreak % 30 === 0) streakBonus = 1000;
      }
      xpAwarded += streakBonus;

      // Todo por incremento: el valor final lo calcula Postgres, no una lectura previa.
      // Así dos peticiones concurrentes suman, en vez de pisarse.
      const updated = await prisma.gamification.update({
        where: { userId: user.id },
        data: {
          xpTotal: { increment: xpAwarded },
          xpWeekly: { increment: xpAwarded },
          vyCoins: { increment: Math.round(xpAwarded / 10) },
          lessonsCompleted: { increment: 1 },
          streakDays: newStreak,
          streakMax: Math.max(user.gamification.streakMax, newStreak),
          lastStudyDate: new Date(),
          daysStudied: { increment: isNewDay ? 1 : 0 },
        },
      });

      // El rango se deriva del total ya consolidado en base de datos.
      newRank = getRank(updated.xpTotal);
      rankChanged = newRank !== updated.rank;
      if (rankChanged) {
        await prisma.gamification.update({
          where: { userId: user.id },
          data: { rank: newRank as any },
        });
      }
    }

    const completedCount = await prisma.lessonProgress.count({
      where: { userId: user.id, lesson: { worldId: lesson.worldId }, completed: true },
    });
    const totalLessons = lesson.world._count.lessons;
    const pct = totalLessons > 0 ? completedCount / totalLessons : 0;

    await prisma.worldProgress.upsert({
      where: { userId_worldId: { userId: user.id, worldId: lesson.worldId } },
      create: { userId: user.id, worldId: lesson.worldId, pctComplete: pct, completed: pct >= 1 },
      update: { pctComplete: pct, completed: pct >= 1 },
    });

    return NextResponse.json({
      success: true, alreadyCompleted, xpAwarded, coinsAwarded: Math.round(xpAwarded / 10), newRank, rankChanged,
      worldProgress: { pctComplete: pct, completed: pct >= 1 },
    });
  } catch (error) {
    console.error("[api/progress] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = PutSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    const { questionId, selectedIndex, timeSpentSec = 0 } = parsed.data;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const question = await prisma.quizQuestion.findUnique({ where: { id: questionId } });
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    const isCorrect = selectedIndex === question.correctIndex;
    const previousCorrectAttempt = await prisma.quizAttempt.findFirst({
      where: { userId: user.id, questionId, isCorrect: true },
    });
    const isPerfect = isCorrect && !previousCorrectAttempt;
    const alreadyAnsweredCorrectly = !!previousCorrectAttempt;

    await prisma.quizAttempt.create({
      data: { userId: user.id, questionId, selectedIndex, isCorrect, isPerfect, timeSpentSec },
    });

    let xpAwarded = 0;
    if (isCorrect && !alreadyAnsweredCorrectly) {
      xpAwarded = isPerfect ? 100 : 60;
      const gamification = await prisma.gamification.findUnique({ where: { userId: user.id } });
      if (gamification) {
      await prisma.gamification.update({
          where: { userId: user.id },
          data: {
            xpTotal: { increment: xpAwarded },
            xpWeekly: { increment: xpAwarded },
            quizPerfect: isPerfect ? { increment: 1 } : undefined,
          },
        });
      }
    }

    return NextResponse.json({
      isCorrect, isPerfect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      xpAwarded,
    });
  } catch (error) {
    console.error("[api/progress PUT] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
