import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const levelId = req.nextUrl.searchParams.get("levelId");
  const resources = await prisma.levelResource.findMany({
    where: levelId ? { levelId } : undefined,
    orderBy: [{ levelId: "asc" }, { order: "asc" }],
  });
  return NextResponse.json({ resources });
}

export async function POST(req: NextRequest) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const body = await req.json();
  const { levelId, type, title, description, url, content, order } = body;
  if (!levelId || !type || !title) {
    return NextResponse.json({ error: "Faltan campos requeridos (levelId, type, title)" }, { status: 400 });
  }
  const resource = await prisma.levelResource.create({
    data: { levelId, type, title, description: description ?? null, url: url ?? null, content: content ?? undefined, order: order ?? 0 },
  });
  return NextResponse.json({ resource });
}
