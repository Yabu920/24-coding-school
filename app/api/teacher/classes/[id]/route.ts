// app/api/teacher/classes/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Params = { params: { id: string } };

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  const course = await prisma.courses.findUnique({ where: { id: params.id } });
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // ensure teacher is owner
  const link = await prisma.teacher_courses.findUnique({ where: { teacher_id_course_id: { teacher_id: teacher.id, course_id: course.id } } });
  if (!link) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // delete course (cascade may remove student_courses)
  await prisma.courses.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
