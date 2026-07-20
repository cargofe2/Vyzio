import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const VY_SYSTEM = `Eres ZAI, el tutor de IA de Bymyzai.

QUÉ ES BYMYZAI (tenlo presente si te preguntan por la plataforma):
Academia AI-native para adolescentes y jóvenes 16+, no es un curso ni un bootcamp. Misión: desarrollar capacidad humana en la era de la IA, no solo enseñar herramientas. Currículo de 9 etapas: Origins (gratis) → Explorer → Thinker → Creator → Builder → Architect → Founder → Researcher → Residency, terminando en un Grand Challenge donde el estudiante construye y lanza algo real. Pilares: aprendizaje basado en proyectos, portafolio primero, mentor de IA persistente (tú), progresión gamificada con XP/rango/racha, VY Coins, certificados verificables públicamente. Si te preguntan tu opinión sobre Bymyzai, responde con honestidad basada en esto — no evadas ni digas que no la conoces.

PERSONALIDAD:
- Directo, entusiasta, sin condescendencia
- El amigo más listo de la clase que explica sin hacerte sentir menos
- NUNCA digas: "¡Gran pregunta!", "Por supuesto!", "¡Claro que sí!"
- Si no sabes algo, dilo directamente

FORMATO:
- Máximo 120 palabras por respuesta
- Usa **negritas** para términos técnicos clave
- Para código: usa backticks con el lenguaje especificado
- Termina con acción concreta cuando sea relevante

SCOPE: Solo hablas de IA, tecnología y aprendizaje. Si preguntan otra cosa, rediriges amablemente.
IDIOMA: Siempre en español.`;

const VY_LIMITS: Record<string, number> = {
  STARTER: 10, PRO: 9999, PREMIUM: 9999, FAMILY: 9999, SCHOOL: 9999, ENTERPRISE: 9999,
};

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message } = await req.json();
    if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

    // Get user and check limits
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { subscription: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const plan = user.subscription?.plan ?? "STARTER";
    const limit = VY_LIMITS[plan] ?? 10;

    // Count today's messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.vyMessage.count({
      where: { userId: user.id, role: "user", createdAt: { gte: today } },
    });

    if (todayCount >= limit) {
      return NextResponse.json({
        error: "daily_limit",
        message: `Límite de ${limit} mensajes diarios alcanzado. Actualiza a Pro para mensajes ilimitados.`,
      }, { status: 429 });
    }

    // Get conversation history (last 10 messages)
    const history = await prisma.vyMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { role: true, content: true },
    });

    // Save user message
    await prisma.vyMessage.create({
      data: { userId: user.id, role: "user", content: message },
    });

    // Call Claude
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: VY_SYSTEM,
      messages: [
        ...history.reverse().map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: message },
      ],
    });

    const assistantMessage = response.content[0].type === "text" ? response.content[0].text : "";
    const tokens = response.usage.input_tokens + response.usage.output_tokens;

    // Save assistant response
    await prisma.vyMessage.create({
      data: { userId: user.id, role: "assistant", content: assistantMessage, tokens },
    });

    return NextResponse.json({
      message: assistantMessage,
      messagesUsedToday: todayCount + 1,
      messagesLimit: limit,
      isUnlimited: plan !== "STARTER",
    });
  } catch (error) {
    console.error("[api/vy] error:", error);
    return NextResponse.json({ error: "Error al conectar con ZAI." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ messages: [] });

    const messages = await prisma.vyMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 30,
      select: { role: true, content: true, createdAt: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.vyMessage.count({
      where: { userId: user.id, role: "user", createdAt: { gte: today } },
    });

    const plan = (await prisma.subscription.findUnique({ where: { userId: user.id } }))?.plan ?? "STARTER";

    return NextResponse.json({
      messages,
      messagesUsedToday: todayCount,
      messagesLimit: VY_LIMITS[plan] ?? 10,
      isUnlimited: plan !== "STARTER",
    });
  } catch (error) {
    console.error("[api/vy GET] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
