import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

const LEVEL_NAMES: Record<string, { es: string; en: string }> = {
  "level-1":     { es: "Nivel 0 — Origins",    en: "Level 0 — Origins" },
  "level-new-1": { es: "Nivel 1 — Explorer",   en: "Level 1 — Explorer" },
  "level-new-2": { es: "Nivel 2 — Thinker",    en: "Level 2 — Thinker" },
  "level-new-3": { es: "Nivel 3 — Creator",    en: "Level 3 — Creator" },
  "level-new-4": { es: "Nivel 4 — Builder",    en: "Level 4 — Builder" },
  "level-new-5": { es: "Nivel 5 — Architect",  en: "Level 5 — Architect" },
  "level-new-6": { es: "Nivel 6 — Founder",    en: "Level 6 — Founder" },
  "level-new-7": { es: "Nivel 7 — Researcher", en: "Level 7 — Researcher" },
  "level-new-8": { es: "Nivel 8 — Residency",  en: "Level 8 — Residency" },
};

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { levelId } = await req.json();
    if (!levelId || !LEVEL_NAMES[levelId]) return NextResponse.json({ error: "levelId invalid" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const totalLessons = await prisma.lesson.count({
      where: { isPublished: true, world: { levelId } },
    });
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId: user.id, completed: true, lesson: { world: { levelId } } },
    });

    if (totalLessons === 0 || completedLessons < totalLessons) {
      return NextResponse.json({
        error: "Level incomplete", completed: completedLessons, total: totalLessons,
      }, { status: 403 });
    }

    const certificate = await prisma.levelCertificate.upsert({
      where: { userId_levelId: { userId: user.id, levelId } },
      create: {
        userId: user.id,
        levelId,
        levelName: LEVEL_NAMES[levelId].es,
        levelNameEn: LEVEL_NAMES[levelId].en,
        studentName: user.displayName,
      },
      update: {},
    });

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error("[api/certificate] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
