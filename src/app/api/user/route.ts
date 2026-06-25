import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: { gamification: true, subscription: true },
    });

    if (!user) {
      const username = `user_${clerkId.slice(-8)}`;
      user = await prisma.user.create({
        data: {
          clerkId,
          email: `${clerkId}@vyzio.app`,
          username,
          displayName: "Estudiante",
          gamification: {
            create: {
              xpTotal: 0, xpWeekly: 0, gems: 0, vyCoins: 0,
              energy: 100, rank: "NOVICE", rankLevel: 1,
              streakDays: 0, streakMax: 0,
            },
          },
          subscription: { create: { plan: "STARTER", status: "ACTIVE" } },
        },
        include: { gamification: true, subscription: true },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[api/user] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { displayName, bio, avatarEmoji } = body;

    const user = await prisma.user.update({
      where: { clerkId },
      data: { displayName, bio, avatarEmoji },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[api/user PATCH] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
