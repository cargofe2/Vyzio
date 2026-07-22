import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BATTLE_LIMITS: Record<string, number> = {
  STARTER: 2, PRO: 5, PREMIUM: 2, FAMILY: 5, SCHOOL: 5, ENTERPRISE: 10,
};

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

    const plan = (await prisma.subscription.findUnique({ where: { userId: user.id } }))?.plan ?? "STARTER";

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { world: { include: { level: true } } },
    });
    if (!lesson) return NextResponse.json({ error: "Leccion no encontrada" }, { status: 404 });

    const levelIsFree = (lesson.world as any)?.level?.isFree ?? false;
    if (!levelIsFree && plan === "STARTER") {
      return NextResponse.json({ error: "plan_required", message: "Los Boss Battles de niveles avanzados requieren plan Pro." }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttempts = await prisma.lessonProgress.count({
      where: { userId: user.id, updatedAt: { gte: today }, lessonId },
    });
    const limit = BATTLE_LIMITS[plan] ?? 2;
    if (todayAttempts >= limit) {
      return NextResponse.json({ error: "battle_limit", message: `Limite de ${limit} intentos diarios alcanzado.`, attemptsLimit: limit }, { status: 429 });
    }

    const content = lesson.content as any;
    const brief = content?.blocks?.map((b: any) => b.text).filter(Boolean).join("\n") ?? lesson.title;

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });
    const attempts = (existing?.attempts ?? 0) + 1;

    const isOrigins = levelIsFree;
    const criterio = isOrigins
      ? "Es el primer Boss Battle del estudiante. Aprueba si la respuesta es honesta y muestra intencion real, aunque sea breve. No exijas profundidad tecnica."
      : "Evalua si demuestra genuinamente la habilidad del brief. Busca evidencia real de comprension y esfuerzo aplicado, no perfeccion.";
    const prompt = `Eres ZAI evaluando un Boss Battle en Bymyzai. Este es el brief del proyecto:\n\n"${brief}"\n\nEsta es la entrega del estudiante:\n\n"${submission}"\n\n${criterio}\n\nResponde en este formato exacto:\n[APROBADO] o [REINTENTAR]\nLuego da feedback directo de 2-3 frases: que esta bien, que falta o mejoraria. Tono: mentor exigente pero alentador, nunca condescendiente. Maximo 80 palabras.`;

    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
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
