// app/api/teacher/classes/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  const courses = await prisma.courses.findMany({
    where: { teacher_courses: { some: { teacher_id: teacher.id } } },
    include: { student_courses: true },
    orderBy: { created_at: "desc" },
  });

  const payload = courses.map((c) => ({ id: c.id, name: c.name, description: c.description, student_count: c.student_courses.length }));
  return NextResponse.json({ courses: payload });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { name, description } = body;
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  const course = await prisma.courses.create({ data: { name, description } });

  // create teacher_courses link
  await prisma.teacher_courses.create({ data: { teacher_id: teacher.id, course_id: course.id } });

  return NextResponse.json({ course: { id: course.id, name: course.name, description: course.description, student_count: 0 } });
}

export async function DELETE(req: Request) {
  // fallback single delete not used by client (we implemented DELETE at /classes/:id)
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
