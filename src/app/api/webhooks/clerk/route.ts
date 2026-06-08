import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const headers = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET ?? "secret");
    wh.verify(payload, headers);
    const event = JSON.parse(payload);
    console.log("Clerk webhook:", event.type);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
}
