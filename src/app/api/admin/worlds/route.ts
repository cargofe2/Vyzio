import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const levels = await prisma.level.findMany({
    orderBy: { order: "asc" },
    include: {
      worlds: {
        orderBy: { order: "asc" },
        include: { _count: { select: { lessons: true } } },
      },
    },
  });
  return NextResponse.json({ levels });
}

export async function POST(req: NextRequest) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const body = await req.json();
  const { levelId, number, name, slug, description, emoji, order, xpReward } = body;
  if (!levelId || number === undefined || !name || !slug || !description || order === undefined) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  try {
    const world = await prisma.world.create({
      data: { levelId, number, name, slug, description, emoji: emoji ?? "🌍", order, xpReward: xpReward ?? 500 },
    });
    return NextResponse.json({ world });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: `No se pudo crear (¿ID/slug/number duplicado?): ${msg}` }, { status: 409 });
  }
}
