// app/api/teacher/notifications/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await prisma.notifications.findMany({
      where: { user_id: session.user.id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("GET /api/teacher/notifications error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
