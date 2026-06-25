import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        quizQuestions: { orderBy: { order: "asc" } },
        world: { include: { level: true } },
      },
    });

    if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    let progress = null;
    if (user) {
      progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId: id } },
      });
    }

    return NextResponse.json({ lesson: { ...lesson, progress } });
  } catch (error) {
    console.error("[api/lessons/[id]] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
