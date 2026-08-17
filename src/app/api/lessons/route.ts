import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/lessons?worldId=xxx
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userRecord = await prisma.user.findUnique({ where: { clerkId }, select: { language: true } });
    const userLang = userRecord?.language ?? "es";

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
          name: userLang === "en" && w.name_en ? w.name_en : w.name,

        })),
      });
    }

    // Get lessons for a world
    if (worldId) {
      const world = await prisma.world.findUnique({ where: { id: worldId }, include: { level: true } });
      const user2 = await prisma.user.findUnique({ where: { clerkId }, include: { subscription: true } });
      const plan = user2?.subscription?.plan ?? "STARTER";
      const levelIsFree = (world as any)?.level?.isFree ?? true;
      const freeLimitForWorld = (world as any)?.freeLessonLimit ?? 0;
      const allLessons = await prisma.lesson.findMany({
        where: { worldId, isPublished: true },
        orderBy: { order: "asc" },
        include: {
          quizQuestions: {
            select: { id: true, question: true, options: true, order: true },
            orderBy: { order: "asc" },
          },
        },
      });
      const lessons = (!levelIsFree && plan === "STARTER")
        ? (freeLimitForWorld > 0 ? allLessons.slice(0, freeLimitForWorld) : allLessons.filter((l: any) => l.isFree))
        : allLessons;

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
          ...l,
          title: userLang === "en" && l.title_en ? l.title_en : l.title,
          progress: lessonProgress[l.id] ?? null,
        })),
      });
    }

    // Get all levels
    const levels = await prisma.level.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { worlds: true } }, worlds: { include: { lessons: { where: { isFree: true }, select: { id: true } } } } },
    });

    return NextResponse.json({ levels: levels.map((l: any) => ({ ...l, free: l.isFree, hasFreeLessons: l.worlds.some((w: any) => w.lessons.length > 0) })) });
  } catch (error) {
    console.error("[api/lessons] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}