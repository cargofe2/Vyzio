import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? "secret");
    const event = wh.verify(payload, headers) as { type: string; data: Record<string, unknown> };

    if (event.type === "user.created") {
      const data = event.data;
      const clerkId = data.id as string;
      const emails = data.email_addresses as Array<{ email_address: string }>;
      const email = emails?.[0]?.email_address ?? `${clerkId}@byzai.app`;
      const firstName = (data.first_name as string) ?? "Estudiante";
      const lastName = (data.last_name as string) ?? "";
      const avatarUrl = data.image_url as string | undefined;
      const username = `user_${clerkId.slice(-8)}`;

      // Check if user already exists
      const existing = await prisma.user.findUnique({ where: { clerkId } });
      if (!existing) {
        await prisma.user.create({
          data: {
            clerkId,
            email,
            username,
            displayName: `${firstName} ${lastName}`.trim() || "Estudiante",
            avatarUrl,
            gamification: {
              create: {
                xpTotal: 0, xpWeekly: 0, gems: 0, vyCoins: 0,
                energy: 100, rank: "NOVICE", rankLevel: 1,
                streakDays: 0, streakMax: 0,
              },
            },
            subscription: { create: { plan: "STARTER", status: "ACTIVE" } },
          },
        });
        console.log(`✅ Created user: ${email}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook/clerk] error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
