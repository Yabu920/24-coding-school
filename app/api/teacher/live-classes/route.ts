import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function POST(req: Request) {
  const session = getSession()
  if (!session || session.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, description, start_time, end_time, video_url } = (await req.json()) as {
    title: string
    description?: string
    start_time: string
    end_time?: string
    video_url?: string
  }

  if (!title || !start_time) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  // find teacher id
  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.sub } })
  if (!teacher) return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 })

  const cls = await prisma.live_classes.create({
    data: {
      title,
      description,
      start_time: new Date(start_time),
      end_time: end_time ? new Date(end_time) : null,
      video_url,
      teacher_id: teacher.id,
    },
  })

  return NextResponse.json({ success: true, class: cls })
}
