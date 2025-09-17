// app/api/student/notifications/clear/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function PUT() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.notifications.updateMany({
    where: { user_id: session.user.id, is_read: false },
    data: { is_read: true },
  })

  return NextResponse.json({ ok: true })
}
