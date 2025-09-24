// app/api/student/assignments/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// TypeScript types for API response
type Submission = {
  submittedFileUrl?: string;
  grade: string | null;
  feedback: string | null;
  submittedAt: string | null;
};

type AssignmentResponse = {
  id: string;
  title: string;
  description: string | null;
  fileUrl?: string;
  dueDate: string | null;
  createdAt: string;
  teacherName: string;
  courseName: string;
  submission: Submission | null;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notifications.findMany({
    where: { user_id: session.user.id },
    orderBy: { created_at: "desc" },
  });
    // Find the student by user ID and include enrolled courses
    const student = await prisma.students.findUnique({
      where: { user_id: session.user.id },
      include: { student_courses: true },
    });

    if (!student) {
      return NextResponse.json({ assignments: [] });
    }

    const courseIds = student.student_courses.map(sc => sc.course_id);

    // Fetch assignments for these courses
    const assignments = await prisma.assignments.findMany({
      where: { course_id: { in: courseIds } },
      include: {
        teacher: { include: { user: true } },
        course: true, // course relation may be null, so we handle safely
        submissions: { where: { student_id: student.id } },
      },
      orderBy: { created_at: "desc" },
    });

    // Map to API-friendly format
    const result: AssignmentResponse[] = assignments.map(a => {
      const submission = a.submissions[0]
        ? {
            submittedFileUrl: a.submissions[0].submitted_file_url || undefined,
            grade: a.submissions[0].grade || null,
            feedback: a.submissions[0].feedback || null,
            submittedAt: a.submissions[0].submitted_at
              ? a.submissions[0].submitted_at.toISOString()
              : null,
          }
        : null;

      return {
        id: a.id,
        title: a.title,
        description: a.description || null,
        fileUrl: a.file_url || undefined,
        dueDate: a.due_date ? a.due_date.toISOString() : null,
        createdAt: a.created_at.toISOString(),
        teacherName: a.teacher?.user?.full_name || "Unknown Teacher",
        courseName: a.course?.name || "Unknown Course",
        submission,
      };
    });

    return NextResponse.json({ assignments: result });
  } catch (err) {
    console.error("❌ Error fetching assignments:", err);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
