// app/api/student/assignments/[assignmentId]/my-submission/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.students.findUnique({
      where: { user_id: session.user.id },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const submission = await prisma.student_assignments.findUnique({
      where: {
        assignment_id_student_id: {
          assignment_id: params.assignmentId,
          student_id: student.id,
        },
      },
      include: {
        assignment: {
          include: {
            teacher: { include: { user: true } }, // teacher info
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "No submission found" }, { status: 404 });
    }

    return NextResponse.json({ submission });
  } catch (err) {
    console.error("Fetch submission error:", err);
    return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 });
  }
}
