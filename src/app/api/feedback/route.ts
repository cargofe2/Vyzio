import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "feedback" });
const FeedbackSchema = z.object({
  category: z.enum(["bug", "suggestion", "content", "other"]),
  rating: z.number().int().min(1).max(5).optional(),
  message: z.string().min(1).max(1000),
  page: z.string().max(200).optional(),
});
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { success: rateLimitOk } = await ratelimit.limit(clerkId);
  if (!rateLimitOk) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await req.json();
  const parsed = FeedbackSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  const { category, rating, message, page } = parsed.data;
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
