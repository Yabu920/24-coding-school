import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

/**
 * Upload a student assignment submission record.
 * In production, integrate storage (e.g., Cloudinary, Supabase) and pass file_url from your uploader.
 */
export async function POST(req: Request) {
  const session = getSession()
  if (!session || session.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) // using lowercase enum values

  const { assignment_id, submitted_file_url } = (await req.json()) as {
    assignment_id: string
    submitted_file_url: string
  }
  if (!assignment_id || !submitted_file_url) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const student = await prisma.students.findUnique({ where: { user_id: session.sub } })
  if (!student) return NextResponse.json({ error: "Student profile not found" }, { status: 404 })

  const submission = await prisma.student_assignments.upsert({
    where: { assignment_id_student_id: { assignment_id, student_id: student.id } },
    update: { submitted_file_url, submitted_at: new Date() },
    create: { assignment_id, student_id: student.id, submitted_file_url, submitted_at: new Date() },
  })

  return NextResponse.json({ success: true, submission })
}
