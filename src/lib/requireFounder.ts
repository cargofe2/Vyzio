import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isEvalMode } from "@/lib/evalMode";

export async function requireFounder() {
  const { userId } = await auth();
  if (!isEvalMode(userId)) {
    return { ok: false as const, res: NextResponse.json({ error: "No autorizado" }, { status: 403 }) };
  }
  return { ok: true as const };
}
