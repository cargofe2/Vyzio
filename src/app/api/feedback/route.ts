import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { category, rating, message, page } = body;
  if (!message || !message.trim()) {
    return NextResponse.json({ error: "El mensaje no puede estar vacío" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });

  const feedback = await prisma.feedback.create({
    data: {
      userId: user?.id ?? null,
      category: category ?? "other",
      rating: rating ?? null,
      message: message.trim(),
      page: page ?? null,
    },
  });
  return NextResponse.json({ feedback });
}
