import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const body = await req.json();
  const { worldId, number, title, slug, type, description, order, durationMin, xpReward } = body;
  if (!worldId || number === undefined || !title || !slug || !type || order === undefined) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  try {
    const lesson = await prisma.lesson.create({
      data: {
        worldId, number, title, slug, type, description: description ?? null,
        order, durationMin: durationMin ?? 5, xpReward: xpReward ?? 75,
        content: { blocks: [] }, isPublished: false,
      },
    });
    return NextResponse.json({ lesson });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: `No se pudo crear (¿ID/slug/number duplicado?): ${msg}` }, { status: 409 });
  }
}
