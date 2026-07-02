import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    const body = await req.json();
    const { lessonId, score, timeSpentSec = 0 } = body;

    if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });

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

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });

    const alreadyCompleted = existing?.completed ?? false;

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      create: {
        userId: user.id, lessonId, completed: true,
        completedAt: new Date(), score, timeSpentSec,
        xpEarned: alreadyCompleted ? 0 : lesson.xpReward,
      },
      update: {
        completed: true, completedAt: new Date(), score,
        xpEarned: alreadyCompleted ? existing?.xpEarned : lesson.xpReward,
      },
    });

    let xpAwarded = 0;
    let newRank: string = user.gamification?.rank ?? "NOVICE";
    let rankChanged = false;

    if (!alreadyCompleted && user.gamification) {
      xpAwarded = lesson.xpReward;
      const newXP = user.gamification.xpTotal + xpAwarded;
      newRank = getRank(newXP);
      rankChanged = newRank !== user.gamification.rank;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastStudy = user.gamification.lastStudyDate;
      const lastStudyDay = lastStudy ? new Date(lastStudy) : null;
      if (lastStudyDay) lastStudyDay.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = user.gamification.streakDays;
      if (!lastStudyDay || lastStudyDay.getTime() < yesterday.getTime()) {
        newStreak = 1;
      } else if (lastStudyDay.getTime() === yesterday.getTime()) {
        newStreak += 1;
      }

      await prisma.gamification.update({
        where: { userId: user.id },
        data: {
          xpTotal: newXP,
          xpWeekly: { increment: xpAwarded },
          vyCoins: { increment: Math.round(xpAwarded / 10) },
          rank: newRank as any,
          lessonsCompleted: { increment: 1 },
          streakDays: newStreak,
          streakMax: Math.max(user.gamification.streakMax, newStreak),
          lastStudyDate: new Date(),
        },
      });
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
    const { questionId, selectedIndex, timeSpentSec = 0 } = body;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const question = await prisma.quizQuestion.findUnique({ where: { id: questionId } });
    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    const isCorrect = selectedIndex === question.correctIndex;
    const previousAttempt = await prisma.quizAttempt.findFirst({
      where: { userId: user.id, questionId },
    });
    const isPerfect = isCorrect && !previousAttempt;

    await prisma.quizAttempt.create({
      data: { userId: user.id, questionId, selectedIndex, isCorrect, isPerfect, timeSpentSec },
    });

    let xpAwarded = 0;
    if (isCorrect) {
      const gamification = await prisma.gamification.findUnique({ where: { userId: user.id } });
      if (gamification) {
        xpAwarded = isPerfect ? 100 : 60;
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
