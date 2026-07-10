import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const settings = await prisma.themeSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const body = await req.json();
  const { key, value } = body;
  if (!key || value === undefined) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  const setting = await prisma.themeSetting.update({ where: { key }, data: { value } });
  return NextResponse.json({ setting });
}
