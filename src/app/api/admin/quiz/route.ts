import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const body = await req.json();
  const { lessonId, question, options, correctIndex, explanation, order } = body;
  if (!lessonId || !question || !Array.isArray(options) || options.length < 2 || correctIndex === undefined || !explanation || order === undefined) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  const quiz = await prisma.quizQuestion.create({
    data: { lessonId, question, options, correctIndex, explanation, order },
  });
  return NextResponse.json({ quiz });
}
