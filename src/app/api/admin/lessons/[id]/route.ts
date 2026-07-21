import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { quizQuestions: { orderBy: { order: "asc" } }, world: { select: { id: true, name: true } } },
  });
  if (!lesson) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json({ lesson });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const body = await req.json();
  const { title, description, content, isPublished, order, durationMin, xpReward, isFree } = body;
  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(isPublished !== undefined && { isPublished }),
      ...(order !== undefined && { order }),
      ...(durationMin !== undefined && { durationMin }),
      ...(xpReward !== undefined && { xpReward }),
      ...(isFree !== undefined && { isFree }),
    },
  });
  return NextResponse.json({ lesson });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
