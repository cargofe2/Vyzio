import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const levelId = req.nextUrl.searchParams.get("levelId");
  if (!levelId) return NextResponse.json({ error: "levelId requerido" }, { status: 400 });

  const resources = await prisma.levelResource.findMany({
    where: { levelId },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ resources });
}
