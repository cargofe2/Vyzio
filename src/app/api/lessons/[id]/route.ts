import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isEvalMode } from "@/lib/evalMode";

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

    const user = await prisma.user.findUnique({ where: { clerkId }, include: { subscription: true } });
    const plan = user?.subscription?.plan ?? "STARTER";
    const levelIsFree = (lesson as any).world?.level?.isFree ?? true;
    const lessonIsFree = lesson.isFree === true;
    console.log("[paywall-debug]", { levelIsFree, lessonIsFree, plan, id });

    if (!levelIsFree && !lessonIsFree && plan === "STARTER" && !isEvalMode(clerkId)) {
      return NextResponse.json({ error: "PAYWALL", requiredPlan: "PRO" }, { status: 402 });
    }

    let progress = null;
    if (user) {
      progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId: id } },
      });
    }

    const userLang = (user as any)?.language ?? "es";
    const { content_en, ...lessonBase } = lesson as any;
    const finalContent = userLang === "en" && content_en ? content_en : lessonBase.content;
    return NextResponse.json({ lesson: { ...lessonBase, content: finalContent, progress } });
  } catch (error) {
    console.error("[api/lessons/[id]] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
