import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isEvalMode } from "@/lib/evalMode";

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: "banned", reason: user.bannedReason ?? "Cuenta excluida" }, { status: 403 });
    }

    return NextResponse.json({ user, evalMode: isEvalMode(clerkId) });
  } catch (error) {
    console.error("[api/user] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

const PatchUserSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
  avatarEmoji: z.string().max(10).optional(),
  language: z.enum(["es", "en"]).optional(),
  age: z.number().int().min(16).max(120).optional(),
  goal: z.string().max(200).optional(),
});

export async function PATCH(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = PatchUserSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    const { displayName, bio, avatarEmoji, language, age, goal } = parsed.data;
    if (age !== undefined && age !== null && age < 16) {
      return NextResponse.json({ error: "Bymyzai está disponible para mayores de 16 años por ahora." }, { status: 403 });
    }

    const user = await prisma.user.update({
      where: { clerkId },
      data: { displayName, bio, avatarEmoji, language, age, goal },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[api/user PATCH] error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
