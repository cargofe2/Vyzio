import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LEVEL_NAMES: Record<string, string> = {
  "level-1": "AI Foundations — Origins",
  "level-new-1": "AI Explorer",
  "level-new-2": "AI Thinker",
  "level-new-3": "AI Creator",
};

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { levelId } = await req.json();
    if (!levelId || !LEVEL_NAMES[levelId]) return NextResponse.json({ error: "levelId inválido" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const totalLessons = await prisma.lesson.count({
      where: { isPublished: true, world: { levelId } },
    });
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId: user.id, completed: true, lesson: { world: { levelId } } },
    });

    if (totalLessons === 0 || completedLessons < totalLessons) {
      return NextResponse.json({
        error: "Nivel incompleto", completed: completedLessons, total: totalLessons,
      }, { status: 403 });
    }

    const certificate = await prisma.certificate.upsert({
      where: { userId_levelId: { userId: user.id, levelId } },
      create: { userId: user.id, levelId, levelName: LEVEL_NAMES[levelId], studentName: user.displayName },
      update: {},
    });

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error("[api/certificate] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
