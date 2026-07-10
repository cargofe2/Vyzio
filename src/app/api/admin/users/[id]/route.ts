import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      subscription: true,
      gamification: true,
      levelCertificates: { select: { levelName: true, issuedAt: true } },
    },
  });
  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const { id } = await params;
  const body = await req.json();
  const { isBanned, bannedReason, plan } = body;

  if (isBanned !== undefined) {
    await prisma.user.update({ where: { id }, data: { isBanned, bannedReason: bannedReason ?? null } });
  }
  if (plan) {
    await prisma.subscription.upsert({
      where: { userId: id },
      update: { plan },
      create: { userId: id, plan, status: "ACTIVE" },
    });
  }
  const user = await prisma.user.findUnique({ where: { id }, include: { subscription: true } });
  return NextResponse.json({ user });
}
