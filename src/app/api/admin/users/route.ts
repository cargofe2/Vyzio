import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireFounder } from "@/lib/requireFounder";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireFounder();
  if (!guard.ok) return guard.res;

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
            { displayName: { contains: q, mode: "insensitive" } },
            { clerkId: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    take: 30,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, clerkId: true, email: true, username: true, displayName: true,
      isBanned: true, createdAt: true, lastSeenAt: true,
      subscription: { select: { plan: true, status: true } },
      gamification: { select: { xpTotal: true, rank: true, lessonsCompleted: true } },
    },
  });
  return NextResponse.json({ users });
}
