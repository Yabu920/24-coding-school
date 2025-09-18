import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, file_url, teacher_id, course_id, due_date } = body;

    // 1. Create the assignment
    const assignment = await prisma.assignments.create({
      data: {
        title,
        description,
        file_url,
        teacher_id,
        course_id,
        due_date,
      },
    });

    // 2. Find students enrolled in this course
    const enrolledStudents = await prisma.student_courses.findMany({
      where: { course_id },
      include: { student: { include: { user: true } } }, // get their user_id
    });

    // 3. Create notifications for each student
    if (enrolledStudents.length > 0) {
      await prisma.notifications.createMany({
        data: enrolledStudents.map((enrollment) => ({
          user_id: enrollment.student.user_id, // 🔑 link to users table
          type: "new_assignment",
          message: `📘 New assignment posted: ${title}`,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      assignment,
    });
  } catch (err) {
  console.error("❌ Error creating assignment:", err);
  return NextResponse.json({ error: "Failed to create assignment", details: String(err) }, { status: 500 });
}
}
