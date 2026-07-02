import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AVATAR_SHOP: Record<string, number> = {
  "🧑‍💻": 0, "🧑‍🎨": 0, "🧑‍🚀": 0, "🧑‍🔬": 0, "🧑‍🎓": 0, "🦾": 0,
  "🐉": 80, "🦄": 80, "🔮": 100, "👾": 100, "🌟": 120, "🧠": 150,
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
