import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        gamification: true,
        subscription: true,
        achievements: {
          include: { achievement: true },
          orderBy: { earnedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get recent lesson completions
    const recentLessons = await prisma.lessonProgress.findMany({
      where: { userId: user.id, completed: true },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: {
        lesson: {
          include: { world: { include: { level: true } } },
        },
      },
    });

    // Get active missions
    const missions = await prisma.mission.findMany({
      where: { isActive: true },
      take: 3,
    });

    const missionProgress = await prisma.missionProgress.findMany({
      where: {
        userId: user.id,
        missionId: { in: missions.map((m: any) => m.id) },
        completed: false,
      },
    });

    const missionMap = Object.fromEntries(missionProgress.map((p: any) => [p.missionId, p]));

    return NextResponse.json({
      gamification: user.gamification,
      subscription: user.subscription,
      achievements: user.achievements,
      recentLessons,
      missions: missions.map((m: any) => ({
        ...m,
        progress: missionMap[m.id] ?? { current: 0, completed: false },
      })),
    });
  } catch (error) {
    console.error("[api/gamification] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
