import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/lessons?worldId=xxx
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const worldId = searchParams.get("worldId");
    const levelId = searchParams.get("levelId");

    // Get worlds for a level
    if (levelId) {
      const worlds = await prisma.world.findMany({
        where: { levelId },
        orderBy: { order: "asc" },
        include: {
          _count: { select: { lessons: true } },
        },
      });

      // Get user progress for these worlds
      const user = await prisma.user.findUnique({ where: { clerkId } });
      let worldProgress: Record<string, number> = {};

      if (user) {
        const progress = await prisma.worldProgress.findMany({
          where: { userId: user.id, worldId: { in: worlds.map((w: any) => w.id) } },
        });
        worldProgress = Object.fromEntries(progress.map((p: any) => [p.worldId, p.pctComplete]));
      }

      return NextResponse.json({
        worlds: worlds.map((w: any) => ({
          ...w,
          pctComplete: worldProgress[w.id] ?? 0,
          lessonCount: w._count.lessons,
        })),
      });
    }

    // Get lessons for a world
    if (worldId) {
      const world = await prisma.world.findUnique({ where: { id: worldId } });
      const lessons = await prisma.lesson.findMany({
        where: { worldId, isPublished: true },
        orderBy: { order: "asc" },
        include: {
          quizQuestions: {
            select: { id: true, question: true, options: true, correctIndex: true, explanation: true, order: true },
            orderBy: { order: "asc" },
          },
        },
      });

      // Get user progress
      const user = await prisma.user.findUnique({ where: { clerkId } });
      let lessonProgress: Record<string, { completed: boolean; score: number | null }> = {};

      if (user) {
        const progress = await prisma.lessonProgress.findMany({
          where: { userId: user.id, lessonId: { in: lessons.map((l: any) => l.id) } },
        });
        lessonProgress = Object.fromEntries(
          progress.map((p: any) => [p.lessonId, { completed: p.completed, score: p.score }])
        );
      }

      return NextResponse.json({
        world,
        lessons: lessons.map((l: any) => ({
          ...l,
          progress: lessonProgress[l.id] ?? null,
        })),
      });
    }

    // Get all levels
    const levels = await prisma.level.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { worlds: true } } },
    });

    return NextResponse.json({ levels: levels.map((l: any) => ({ ...l, free: l.isFree })) });
  } catch (error) {
    console.error("[api/lessons] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
