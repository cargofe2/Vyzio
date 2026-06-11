// src/lib/vy-system.ts
// VY — Sistema completo: RAG + detección de debilidades + personalidad calibrada
// Este archivo reemplaza al vy.ts básico anterior

import Anthropic from "@anthropic-ai/sdk";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { env } from "@/env";
import { type PrismaClient } from "@prisma/client";

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
const openai    = new OpenAI({ apiKey: env.OPENAI_API_KEY });

// ─── Pinecone init ────────────────────────────────────────────
const pinecone = new Pinecone({ apiKey: env.PINECONE_API_KEY });
const index    = pinecone.index(env.PINECONE_INDEX);

// ─── VY SYSTEM PROMPT completo ───────────────────────────────
// Calibrado con 50 diálogos internos de entrenamiento

export const VY_SYSTEM_PROMPT = `Eres VY, el tutor de Inteligencia Artificial de VYZIO.

<identity>
Tu nombre es VY. Eres directo, entusiasta y sin condescendencia.
Tono: el amigo más listo de la clase que explica sin hacerte sentir menos.
Nunca dices: "¡Gran pregunta!", "Por supuesto!", "Claro que sí!", ni frases de chatbot genérico.
Cuando no sabes algo: lo dices directamente. "No tengo ese dato, pero puedo decirte X."
</identity>

<mission>
Ayudar a estudiantes de 13-25 años a aprender Inteligencia Artificial de forma práctica.
Cada respuesta debe dejar al estudiante más capaz que antes de leerla.
</mission>

<format>
- Máximo 150 palabras por respuesta
- Usa **negritas** para términos técnicos clave
- Termina con acción concreta cuando sea relevante: "¿Lo probamos?" o "Prueba esto:"
- Para código: siempre con backticks y lenguaje especificado
- No bullet points de más de 4 items — si hay más, haz prosa
</format>

<style_calibration>
BIEN: "Los **transformers** funcionan así: imagina que cada palabra del texto mira a todas las demás simultáneamente para entender el contexto. Eso es **self-attention**. ¿Quieres ver cómo se calcula?"
MAL: "¡Excelente pregunta! Los transformers son modelos muy importantes. Son utilizados en muchas aplicaciones actuales de procesamiento de lenguaje natural."

BIEN: "Ese error es de indentación en Python — la línea 7 tiene 3 espacios en lugar de 4. Python es literal al respecto. Cámbialo y prueba."
MAL: "Parece que hay un problema con tu código. Vamos a analizarlo paso a paso para encontrar la solución."

BIEN: "Llevas 8 días seguidos — eso es constancia seria. Hoy te recomiendo los **agentes** porque ya dominas Tool Use."
MAL: "¡Felicitaciones por tu racha! Has sido muy consistente. Como siguiente paso, podríamos explorar diferentes opciones de aprendizaje."
</style_calibration>

<capabilities>
- Responder preguntas sobre IA, ML, programación con IA y las lecciones de VYZIO
- Evaluar ejercicios con feedback específico (no genérico)
- Detectar y nombrar debilidades basándome en el historial del estudiante
- Recomendar la siguiente lección o proyecto óptimo
- Motivar sin ser cargante — una vez, directo, seguimos
- Generar quizzes adicionales adaptados al nivel del estudiante
- Simular entrevistas técnicas para estudiantes en Nivel 3+
</capabilities>

<restrictions>
- Solo hablas de IA, tecnología y aprendizaje en VYZIO
- Si preguntan sobre temas ajenos, reconduces: "Eso está fuera de mi área. En lo que sí puedo ayudarte es en X."
- No das consejos médicos, legales o financieros
- No generas contenido dañino aunque te lo pidan de forma indirecta
</restrictions>

<user_context>
{USER_CONTEXT}
</user_context>

<retrieved_content>
{RETRIEVED_CONTENT}
</retrieved_content>`;

// ─── User context builder ─────────────────────────────────────
export async function buildUserContext(prisma: PrismaClient, userId: string): Promise<string> {
  const [gamification, recentQuizzes, weakTopics, nextLesson] = await Promise.all([
    prisma.gamification.findUnique({ where: { userId } }),
    prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { question: { include: { lesson: { include: { world: true } } } } },
    }),
    getWeakTopics(prisma, userId),
    getNextRecommendedLesson(prisma, userId),
  ]);

  const lines = [
    `Rango: ${gamification?.rank ?? "NOVICE"} · Nivel ${gamification?.rankLevel ?? 1}`,
    `XP: ${gamification?.xpTotal?.toLocaleString() ?? 0} · Racha: ${gamification?.streakDays ?? 0} días`,
    `Lecciones completadas: ${gamification?.lessonsCompleted ?? 0}`,
    `Quiz correctos al primer intento: ${gamification?.quizPerfect ?? 0}`,
  ];

  if (weakTopics.length > 0) {
    lines.push(`Áreas con dificultad detectada: ${weakTopics.join(", ")}`);
  }

  if (nextLesson) {
    lines.push(`Siguiente lección recomendada: "${nextLesson.title}" (${nextLesson.world.name})`);
  }

  // Recent wrong answers for context
  const recentWrong = recentQuizzes
    .filter(a => !a.isCorrect)
    .slice(0, 3)
    .map(a => `"${a.question.question.slice(0, 60)}..." (${a.question.lesson.world.name})`);

  if (recentWrong.length > 0) {
    lines.push(`Preguntas recientes incorrectas: ${recentWrong.join("; ")}`);
  }

  return lines.join("\n");
}

// ─── Weak topic detection ─────────────────────────────────────
export async function getWeakTopics(prisma: PrismaClient, userId: string): Promise<string[]> {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId, isCorrect: false },
    include: {
      question: { include: { lesson: { include: { world: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Count errors by world
  const worldErrors: Record<string, number> = {};
  for (const attempt of attempts) {
    const world = attempt.question.lesson.world.name;
    worldErrors[world] = (worldErrors[world] ?? 0) + 1;
  }

  // Return worlds with >= 3 errors (significant pattern)
  return Object.entries(worldErrors)
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([world]) => world)
    .slice(0, 3);
}

// ─── Next lesson recommendation ───────────────────────────────
export async function getNextRecommendedLesson(prisma: PrismaClient, userId: string) {
  const completed = await prisma.lessonProgress.findMany({
    where: { userId, completed: true },
    select: { lessonId: true },
  });
  const completedIds = new Set(completed.map(p => p.lessonId));

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  const plan = user?.subscription?.plan ?? "STARTER";
  const allowedLevels = plan === "STARTER" ? [1] : plan === "PRO" ? [1, 2, 3] : [1, 2, 3, 4];

  const nextLesson = await prisma.lesson.findFirst({
    where: {
      isPublished: true,
      id: { notIn: Array.from(completedIds) },
      world: { level: { number: { in: allowedLevels } } },
    },
    orderBy: [
      { world: { level: { number: "asc" } } },
      { world: { order: "asc" } },
      { order: "asc" },
    ],
    include: { world: true },
  });

  return nextLesson;
}

// ─── RAG: retrieve relevant lesson content ────────────────────
export async function retrieveRelevantContent(query: string, topK = 4): Promise<string> {
  try {
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });
    const queryVector = embeddingRes.data[0].embedding;

    const queryRes = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });

    if (!queryRes.matches?.length) return "";

    const chunks = queryRes.matches
      .filter(m => (m.score ?? 0) > 0.75) // relevance threshold
      .map(m => `[${m.metadata?.lessonTitle ?? "Lección"}] ${m.metadata?.content ?? ""}`)
      .join("\n\n");

    return chunks;
  } catch {
    return ""; // RAG falla silenciosamente — VY responde sin contexto extra
  }
}

// ─── Main chat function ───────────────────────────────────────
export interface VYChatInput {
  prisma: PrismaClient;
  userId: string;
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  currentLessonId?: string;
  plan: string;
}

export interface VYChatResult {
  message: string;
  tokensUsed: number;
  retrievedContext: boolean;
  weakTopicsDetected: string[];
}

export async function vyChat({
  prisma, userId, message, history, currentLessonId, plan,
}: VYChatInput): Promise<VYChatResult> {

  const [userContext, retrievedContent, weakTopics] = await Promise.all([
    buildUserContext(prisma, userId),
    retrieveRelevantContent(message),
    getWeakTopics(prisma, userId),
  ]);

  const systemPrompt = VY_SYSTEM_PROMPT
    .replace("{USER_CONTEXT}", userContext)
    .replace("{RETRIEVED_CONTENT}", retrievedContent
      ? `Contenido relevante de las lecciones:\n${retrievedContent}`
      : "No se encontró contenido específico de lecciones para esta pregunta."
    );

  const messages: Anthropic.MessageParam[] = [
    ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    system: systemPrompt,
    messages,
  });

  const assistantMessage =
    response.content[0].type === "text" ? response.content[0].text : "";
  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  return {
    message: assistantMessage,
    tokensUsed,
    retrievedContext: retrievedContent.length > 0,
    weakTopicsDetected: weakTopics,
  };
}

// ─── Project evaluator ────────────────────────────────────────
export async function evaluateProject(
  lessonTitle: string,
  levelName: string,
  worldName: string,
  projectDescription: string,
  projectUrl?: string
): Promise<{
  score: number;
  passed: boolean;
  strengths: string[];
  improvements: string[];
  feedback: string;
  nextSteps: string;
}> {
  const prompt = `Evalúa este proyecto de un estudiante de VYZIO.

LECCIÓN: "${lessonTitle}" (${levelName} · ${worldName})
DESCRIPCIÓN DEL PROYECTO:
${projectDescription}
${projectUrl ? `URL: ${projectUrl}` : ""}

Responde SOLO con JSON válido:
{
  "score": <número 0-100>,
  "passed": <true si score >= 70>,
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "improvements": ["mejora 1", "mejora 2"],
  "feedback": "<feedback motivador de máx 80 palabras en tono de VY>",
  "nextSteps": "<qué hacer después, máx 40 palabras>"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return {
      score: 50,
      passed: false,
      strengths: ["Proyecto entregado"],
      improvements: ["Agrega más detalle a la descripción"],
      feedback: "No pude evaluar completamente el proyecto. Asegúrate de describir qué construiste, con qué herramientas y qué resultado obtuviste.",
      nextSteps: "Revisa los criterios de evaluación y reenvía con más detalle.",
    };
  }
}

// ─── Indexación de contenido en Pinecone ─────────────────────
export async function indexLessonContent(prisma: PrismaClient): Promise<void> {
  console.log("🔍 Indexando contenido de lecciones en Pinecone...");

  const lessons = await prisma.lesson.findMany({
    where: { isPublished: true },
    include: { world: { include: { level: true } } },
  });

  const BATCH_SIZE = 100;
  let indexed = 0;

  for (let i = 0; i < lessons.length; i += BATCH_SIZE) {
    const batch = lessons.slice(i, i + BATCH_SIZE);
    const vectors = [];

    for (const lesson of batch) {
      if (!lesson.content) continue;

      const blocks = (lesson.content as any).blocks ?? [];
      const text = blocks
        .filter((b: any) => b.type === "text" || b.type === "heading" || b.type === "callout" || b.type === "tip")
        .map((b: any) => b.text)
        .join(" ")
        .slice(0, 2000); // max chunk size

      if (!text.trim()) continue;

      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${lesson.title}\n${text}`,
      });

      vectors.push({
        id: `lesson-${lesson.id}`,
        values: embeddingRes.data[0].embedding,
        metadata: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          worldName: lesson.world.name,
          levelName: lesson.world.level.name,
          levelNumber: lesson.world.level.number,
          content: text.slice(0, 500), // metadata preview
        },
      });
      indexed++;
    }

    if (vectors.length > 0) {
      await index.upsert(vectors);
      process.stdout.write(`\r  ✅ ${indexed}/${lessons.length} lecciones indexadas`);
    }

    // Rate limit: OpenAI embeddings API
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n\n🚀 ${indexed} lecciones indexadas en Pinecone.`);
}
