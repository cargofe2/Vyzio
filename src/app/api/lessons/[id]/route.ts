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
        // select explicito: sin el, Prisma devuelve todas las columnas y la respuesta
        // correcta viaja al navegador. La correccion la da PUT /api/progress al contestar.
        quizQuestions: {
          select: { id: true, question: true, options: true, order: true },
          orderBy: { order: "asc" },
        },
        world: { include: { level: true } },
      },
    });

    if (!lesson) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { clerkId }, include: { subscription: true } });
    const plan = user?.subscription?.plan ?? "STARTER";
    const levelIsFree = (lesson as any).world?.level?.isFree ?? true;
    const lessonIsFree = lesson.isFree === true;
    const worldId = (lesson as any).world?.id ?? "";
    const freeLimit = (lesson as any).world?.freeLessonLimit ?? 0;
    const lessonOrder = lesson.order ?? 999;
    const isWithinFreeLimit = freeLimit > 0 && lessonOrder <= freeLimit;
    if (!levelIsFree && !lessonIsFree && !isWithinFreeLimit && plan === "STARTER" && !isEvalMode(clerkId)) {
      return NextResponse.json({ error: "PAYWALL", requiredPlan: "PRO" }, { status: 402 });
    }

    let progress = null;
    if (user) {
      progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId: id } },
      });
    }

    const userLang = (user as any)?.language ?? "es";
    const { content_en, title_en, ...lessonBase } = lesson as any;
    const finalContent = userLang === "en" && content_en ? content_en : lessonBase.content;
    const finalTitle = userLang === "en" && title_en ? title_en : lessonBase.title;
    const worldNameEn = (lessonBase.world as any)?.name_en;
    const finalWorldName = userLang === "en" && worldNameEn ? worldNameEn : lessonBase.world?.name;
    return NextResponse.json({ lesson: { ...lessonBase, title: finalTitle, content: finalContent, world: { ...lessonBase.world, name: finalWorldName }, progress } });
  } catch (error) {
    console.error("[api/lessons/[id]] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}