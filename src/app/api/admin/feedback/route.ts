import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const feedbackRaw = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const userIds = [...new Set(feedbackRaw.map(f => f.userId).filter(Boolean))] as string[];
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, username: true, displayName: true },
  });
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  const feedback = feedbackRaw.map(f => ({ ...f, user: f.userId ? userMap[f.userId] ?? null : null }));
  return NextResponse.json({ feedback });
}
