import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const body = await req.json();
  const { question, options, correctIndex, explanation, order } = body;
  const quiz = await prisma.quizQuestion.update({
    where: { id },
    data: {
      ...(question !== undefined && { question }),
      ...(options !== undefined && { options }),
      ...(correctIndex !== undefined && { correctIndex }),
      ...(explanation !== undefined && { explanation }),
      ...(order !== undefined && { order }),
    },
  });
  return NextResponse.json({ quiz });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  await prisma.quizQuestion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
