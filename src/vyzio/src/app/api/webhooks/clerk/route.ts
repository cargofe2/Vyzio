// src/app/api/webhooks/clerk/route.ts
// Auto-creates VYZIO user + gamification + subscription on Clerk signup

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { env } from "@/env";

interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    image_url: string | null;
  };
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: ClerkUserCreatedEvent;

  try {
    event = wh.verify(payload, headers) as ClerkUserCreatedEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "user.created") {
    return NextResponse.json({ received: true });
  }

  const { id: clerkId, email_addresses, first_name, last_name, username, image_url } = event.data;
  const email = email_addresses[0]?.email_address;
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  const displayName = [first_name, last_name].filter(Boolean).join(" ") || "VYZIO User";

  // Generate unique username if not provided
  const baseUsername = username ?? email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
  const finalUsername = await getUniqueUsername(baseUsername);

  try {
    await prisma.user.create({
      data: {
        clerkId,
        email,
        displayName,
        username: finalUsername,
        avatarUrl: image_url,
        gamification: { create: {} },
        subscription: { create: { plan: "STARTER" } },
      },
    });

    console.log(`✅ VYZIO user created: ${email} (${clerkId})`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error creating VYZIO user:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

async function getUniqueUsername(base: string): Promise<string> {
  let username = base.slice(0, 20);
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? username : `${username}${suffix}`;
    const existing = await prisma.user.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    suffix++;
  }
}
