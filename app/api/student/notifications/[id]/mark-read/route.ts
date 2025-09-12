// app/api/notifications/[id]/mark-read/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    // ensure notification belongs to user
    const notif = await prisma.notifications.findUnique({ where: { id } });
    if (!notif || notif.user_id !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.notifications.update({ where: { id }, data: { is_read: true } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("mark-read", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
