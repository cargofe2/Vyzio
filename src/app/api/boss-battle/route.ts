import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lessonId, submission } = await req.json();
    if (!lessonId || !submission?.trim()) {
      return NextResponse.json({ error: "lessonId y submission requeridos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) return NextResponse.json({ error: "Lección no encontrada" }, { status: 404 });

    const content = lesson.content as any;
    const brief = content?.blocks?.map((b: any) => b.text).filter(Boolean).join("\n") ?? lesson.title;

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });
    const attempts = (existing?.attempts ?? 0) + 1;

    const prompt = `Eres ZAI evaluando un Boss Battle en BYZAI. Este es el brief del proyecto:\n\n"${brief}"\n\nEsta es la entrega del estudiante:\n\n"${submission}"\n\nEvalúa si la entrega demuestra genuinamente la habilidad del brief (no busques perfección, busca evidencia real de comprensión y esfuerzo aplicado). Responde en este formato exacto:\n[APROBADO] o [REINTENTAR]\nLuego da feedback directo de 2-3 frases: qué está bien, qué falta o mejoraría. Tono: mentor exigente pero alentador, nunca condescendiente. Máximo 80 palabras.`;

    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = msg.content[0].type === "text" ? msg.content[0].text : "";
    const passed = /\[APROBADO\]/i.test(raw);
    const feedback = raw.replace(/^\[(APROBADO|REINTENTAR)\]\s*/i, "");

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      create: { userId: user.id, lessonId, submission, battlePassed: passed, battleFeedback: feedback, attempts: 1 },
      update: { submission, battlePassed: passed, battleFeedback: feedback, attempts },
    });

    return NextResponse.json({ passed, feedback, attempts });
  } catch (error) {
    console.error("[api/boss-battle] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
