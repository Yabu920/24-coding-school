
// app/api/teacher/assignments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

/**
 * DTO types used for mapping (explicit to avoid implicit any)
 */
type StudentUserDTO = {
  id: string;
  full_name: string;
  email: string;
  username?: string | null;
  phone?: string | null;
};

type StudentDTO = {
  id: string;
  grade_level?: string | null;
  enrollment_date: Date;
  progress_score: number;
  user: StudentUserDTO;
};

type SubmissionDTO = {
  id: string;
  submitted_file_url?: string | null;
  submitted_at?: Date | null;
  grade?: string | null;
  feedback?: string | null;
  student: StudentDTO;
};

type AssignmentRow = {
  id: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  created_at: Date;
  due_date?: Date | null;
  teacher_id: string;
  course_id?: string | null;
  submissions: SubmissionDTO[];
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacher = await prisma.teachers.findUnique({
      where: { user_id: session.user.id },
    });
    if (!teacher) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // read optional filter query param
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // "submitted" | "unsubmitted" | null

    // fetch assignments with student_assignments (submissions) and student.user
    const assignments = await prisma.assignments.findMany({
      where: { teacher_id: teacher.id },
      orderBy: { created_at: "desc" },
      include: {
        submissions: {
          // select the fields we need from student_assignments
          select: {
            id: true,
            submitted_file_url: true,
            submitted_at: true,
            grade: true,
            feedback: true,
            student: {
              select: {
                id: true,
                grade_level: true,
                enrollment_date: true,
                progress_score: true,
                user: {
                  select: {
                    id: true,
                    full_name: true,
                    email: true,
                    username: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // map db rows to API DTO
    let mapped = assignments.map((a: AssignmentRow) => ({
      id: a.id,
      title: a.title,
      description: a.description ?? undefined,
      file_url: a.file_url ?? undefined,
      created_at: a.created_at.toISOString(),
      due_date: a.due_date ? a.due_date.toISOString() : undefined,
      assigned_to: a.submissions.map((sa: SubmissionDTO) => ({
        id: sa.student.id,
        full_name: sa.student.user.full_name,
        email: sa.student.user.email,
        username: sa.student.user.username ?? undefined,
        phone: sa.student.user.phone ?? undefined,
        grade_level: sa.student.grade_level ?? undefined,
        enrollment_date: sa.student.enrollment_date.toISOString(),
        progress_score: sa.student.progress_score,
        submitted: !!sa.submitted_file_url || !!sa.submitted_at,
        submitted_file_url: sa.submitted_file_url ?? undefined,
        submitted_at: sa.submitted_at ? sa.submitted_at.toISOString() : undefined,
        grade: sa.grade ?? undefined,
        feedback: sa.feedback ?? undefined,
      })),
    }));

    // apply filter if requested
    if (filter === "submitted") {
      // keep assignments that have at least one submitted student
      mapped = mapped.filter((a) => a.assigned_to.some((s) => s.submitted === true));
    } else if (filter === "unsubmitted") {
      // keep assignments that have at least one unsubmitted student
      mapped = mapped.filter((a) => a.assigned_to.some((s) => s.submitted === false));
    }

    return NextResponse.json({ assignments: mapped });
  } catch (err) {
    console.error("GET /api/teacher/assignments error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacher = await prisma.teachers.findUnique({
      where: { user_id: session.user.id },
    });
    if (!teacher) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // robust body parsing
    let body: any = null;
    try {
      body = await req.json();
    } catch (_e) {
      try {
        const txt = await req.text();
        body = txt ? JSON.parse(txt) : null;
      } catch (err2) {
        console.error("Failed to parse body:", err2);
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
      }
    }

    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    let { title, description, due_date, studentIds, courseId } = body;

    // Normalize studentIds to array
    if (typeof studentIds === "string") {
      try {
        const parsed = JSON.parse(studentIds);
        studentIds = Array.isArray(parsed)
          ? parsed
          : studentIds
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
      } catch (_err) {
        studentIds = studentIds
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }
    if (!Array.isArray(studentIds)) studentIds = body.students ?? body.student_ids ?? [];

    if (!title || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one student required" },
        { status: 400 }
      );
    }

    // create assignment
    const assignment = await prisma.assignments.create({
      data: {
        title,
        description: description ?? null,
        teacher_id: teacher.id,
        course_id: courseId ?? null,
        due_date: due_date ? new Date(due_date) : null,
      },
    });

    // create student_assignments rows
    const createManyPayload = (studentIds as string[]).map((sid) => ({
      assignment_id: assignment.id,
      student_id: sid,
    }));
    await prisma.student_assignments.createMany({
      data: createManyPayload,
      skipDuplicates: true,
    });

    // create notifications for students (use users.user_id)
    const students = await prisma.students.findMany({
      where: { user_id: { in: studentIds as string[] } },
      select: { user_id: true },
    });

    const notifPayload = students
      .filter((s) => !!s.user_id)
      .map((s) => ({
        user_id: s.user_id!,
        type: "new_assignment",
        message: `📘 New assignment "${assignment.title}" has been posted.`,
      }));

    if (notifPayload.length > 0) {
      await prisma.notifications.createMany({ data: notifPayload });
    }

    return NextResponse.json({ id: assignment.id });
  } catch (err) {
    console.error("POST /api/teacher/assignments error:", err);
    return NextResponse.json(
      { error: "Failed to create assignment", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
