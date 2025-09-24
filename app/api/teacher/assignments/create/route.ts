// app/api/teacher/assignments/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const title = (form.get("title") as string) ?? "";
    const description = (form.get("description") as string) ?? "";
    const courseId = form.get("courseId")?.toString() ?? null;
    const dueDateRaw = form.get("dueDate")?.toString() ?? null;
    const file = form.get("file") as File | null;

    if (!title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // find teacher record
    const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    // handle optional file upload
    let fileUrl: string | null = null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public", "assignments");
      await fs.mkdir(uploadsDir, { recursive: true });
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const writePath = path.join(uploadsDir, safeName);
      await fs.writeFile(writePath, buffer);
      fileUrl = `/assignments/${safeName}`;
    }

    const created = await prisma.assignments.create({
      data: {
        title,
        description: description || null,
        teacher_id: teacher.id,
        course_id: courseId || null,
        due_date: dueDateRaw ? new Date(dueDateRaw) : null,
        file_url: fileUrl || null,
      },
    });

    // add notifications
    // after assignment is created
const enrolledStudents = await prisma.student_courses.findMany({
  where: { course_id: courseId ?? undefined },
  include: { student: { include: { user: true } } },
});

if (enrolledStudents.length > 0) {
  await prisma.notifications.createMany({
    data: enrolledStudents.map(sc => ({
      user_id: sc.student.user_id,
      type: "assignment",
      message: `New assignment posted: ${title}`,
      link: `/student/assignments/${created.id}`, // optional, for deep linking
    })),
  });
}

    

    return NextResponse.json({ success: true, assignment: created });
  } catch (err) {
    console.error("Create assignment error:", err);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}



