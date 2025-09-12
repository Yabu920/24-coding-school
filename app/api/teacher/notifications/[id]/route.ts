import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Params = { params: { id: string } };

export async function PATCH(_: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const notif = await prisma.notifications.update({
      where: { id },
      data: { is_read: true },
    });

    return NextResponse.json({ success: true, notification: notif });
  } catch (err) {
    console.error("PATCH /api/teacher/notifications/[id] error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
