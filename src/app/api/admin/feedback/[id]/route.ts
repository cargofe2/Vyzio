import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const { status } = await req.json();
  const feedback = await prisma.feedback.update({ where: { id }, data: { status } });
  return NextResponse.json({ feedback });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  await prisma.feedback.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
