import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AVATAR_SHOP: Record<string, number> = {
  "orb-1": 0, "orb-2": 0, "orb-3": 0, "orb-4": 0, "orb-5": 0,
  "orb-6": 0, "orb-7": 0, "orb-8": 0, "orb-9": 0, "orb-10": 0,
  "orb-11": 80, "orb-12": 80, "orb-13": 100, "orb-14": 100,
  "orb-15": 120, "orb-16": 120, "orb-17": 140, "orb-18": 150,
  "orb-19": 180, "orb-20": 220,
};

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { avatar } = await req.json();
    const price = AVATAR_SHOP[avatar];
    if (price === undefined) return NextResponse.json({ error: "Avatar no existe" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId }, include: { gamification: true } });
    if (!user || !user.gamification) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    if (price === 0 || user.unlockedAvatars.includes(avatar)) {
      return NextResponse.json({ success: true, alreadyUnlocked: true, avatar });
    }

    if (user.gamification.vyCoins < price) {
      return NextResponse.json({ error: "Monedas insuficientes", needed: price, have: user.gamification.vyCoins }, { status: 402 });
    }

    await prisma.$transaction([
      prisma.gamification.update({ where: { userId: user.id }, data: { vyCoins: { decrement: price } } }),
      prisma.user.update({ where: { id: user.id }, data: { unlockedAvatars: { push: avatar } } }),
    ]);

    return NextResponse.json({ success: true, avatar, spent: price });
  } catch (error) {
    console.error("[api/shop/avatar] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
