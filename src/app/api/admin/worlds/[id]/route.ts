import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const world = await prisma.world.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" }, include: { _count: { select: { quizQuestions: true } } } } },
  });
  if (!world) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ world });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const body = await req.json();
  const { name, description, emoji, order, xpReward, number, isFree } = body;
  const world = await prisma.world.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(emoji !== undefined && { emoji }),
      ...(order !== undefined && { order }),
      ...(xpReward !== undefined && { xpReward }),
      ...(number !== undefined && { number }),
      ...(isFree !== undefined && { isFree }),
    },
  });
  return NextResponse.json({ world });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const lessonCount = await prisma.lesson.count({ where: { worldId: id } });
  if (lessonCount > 0) {
    return NextResponse.json({ error: `Este world tiene ${lessonCount} lecciones. Bórralas primero.` }, { status: 409 });
  }
  await prisma.world.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
