
// // app/api/teacher/assignments/route.ts
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/authOptions";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "teacher") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
//   if (!teacher) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const assignments = await prisma.assignments.findMany({
//     where: { teacher_id: teacher.id },
//     orderBy: { created_at: "desc" },
//     include: {
//       submissions: {
//         include: {
//           student: { include: { user: true } },
//         },
//       },
//     },
//   });

//   const mapped = assignments.map((a) => ({
//     id: a.id,
//     title: a.title,
//     description: a.description ?? undefined,
//     file_url: a.file_url ?? undefined,
//     created_at: a.created_at.toISOString(),
//     due_date: a.due_date ? a.due_date.toISOString() : undefined,
//     assigned_to: a.submissions.map((sa) => ({
//       id: sa.student.id,
//       full_name: sa.student.user.full_name,
//       email: sa.student.user.email,
//       username: sa.student.user.username ?? undefined,
//       phone: sa.student.user.phone ?? undefined,
//       grade_level: sa.student.grade_level ?? undefined,
//       enrollment_date: sa.student.enrollment_date.toISOString(),
//       progress_score: sa.student.progress_score,
//     })),
//   }));

//   return NextResponse.json({ assignments: mapped });
// }

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "teacher") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
//   if (!teacher) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   // robust body parsing
//   let body: any = null;
//   try {
//     body = await req.json();
//   } catch (err) {
//     // fallback: try to read text and parse
//     try {
//       const txt = await req.text();
//       body = txt ? JSON.parse(txt) : null;
//     } catch (err2) {
//       console.error("Failed to parse body as JSON:", err2);
//       body = null;
//     }
//   }

//   if (!body) {
//     return NextResponse.json({ error: "Invalid body" }, { status: 400 });
//   }

//   // Accept multiple possible shapes for studentIds
//   let { title, description, due_date, studentIds, courseId } = body;

//   // if studentIds is a string — maybe JSON string or comma-separated
//   if (typeof studentIds === "string") {
//     // try parsing JSON string "[...]" first
//     try {
//       const parsed = JSON.parse(studentIds);
//       if (Array.isArray(parsed)) studentIds = parsed;
//       else studentIds = studentIds.split(",").map((s) => s.trim()).filter(Boolean);
//     } catch {
//       // comma-separated fallback
//       studentIds = (studentIds as string).split(",").map((s: string) => s.trim()).filter(Boolean);
//     }
//   }

//   // If some clients send the list under a different key 'students' or 'student_ids'
//   if (!Array.isArray(studentIds)) {
//     studentIds = body.students ?? body.student_ids ?? body.selectedStudents ?? studentIds;
//   }

//   // final normalization: ensure array
//   if (!Array.isArray(studentIds)) {
//     // if it's a single id string still, convert to array
//     if (typeof studentIds === "string" && studentIds.trim()) {
//       studentIds = [studentIds.trim()];
//     } else {
//       studentIds = [];
//     }
//   }

//   // require title and at least one student
//   if (!title || studentIds.length === 0) {
//     return NextResponse.json({ error: "title and at least one student required" }, { status: 400 });
//   }

//   try {
//     const assignment = await prisma.assignments.create({
//       data: {
//         title,
//         description: typeof description === "string" ? description : description ?? null,
//         teacher_id: teacher.id,
//         course_id: courseId ?? null,
//         due_date: due_date ? new Date(due_date) : null,
//       },
//     });

//     if (studentIds.length > 0) {
//   const createManyPayload = studentIds.map((sid: string) => ({
//     assignment_id: assignment.id,
//     student_id: sid,
//   }));

//   await prisma.student_assignments.createMany({
//     data: createManyPayload,
//     skipDuplicates: true,
//   });

//   // ---------- robust notification logic ----------
//   // Try resolving as students.id first
//   let students = await prisma.students.findMany({
//     where: { id: { in: studentIds } },
//     select: { id: true, user_id: true },
//   });

//   // If none found, maybe studentIds are actually user_id values
//   if (!students.length) {
//     students = await prisma.students.findMany({
//       where: { user_id: { in: studentIds } },
//       select: { id: true, user_id: true },
//     });
//   }

//   const notifPayload = students
//     .map((s) =>
//       s.user_id
//         ? {
//             user_id: s.user_id,
//             type: "new_assignment",
//             message: `A new assignment "${assignment.title}" has been posted for your course.`,
//           }
//         : null
//     )
//     .filter(Boolean) as { user_id: string; type: string; message: string }[];

//   if (notifPayload.length) {
//     const result = await prisma.notifications.createMany({ data: notifPayload });
//     console.log(
//       "🔔 created notifications for assignment",
//       assignment.id,
//       "payloadCount:",
//       notifPayload.length,
//       "prismaResult:",
//       result
//     );
//   } else {
//     console.log(
//       "🔔 no notifications created (no students found or no user_id). studentIds:",
//       studentIds,
//       "studentsResolved:",
//       students
//     );
//   }
//   // -------------------------------------------------
// }


//     return NextResponse.json({ id: assignment.id });
//   } catch (err) {
//     console.error("Error creating assignment:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
// // // app/api/teacher/assignments/route.ts




// app/api/teacher/assignments/route.ts
// app/api/teacher/assignments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assignments = await prisma.assignments.findMany({
    where: { teacher_id: teacher.id },
    orderBy: { created_at: "desc" },
    include: {
      submissions: {
        include: {
          student: { include: { user: true } },
        },
      },
    },
  });

  const mapped = assignments.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description ?? undefined,
    file_url: a.file_url ?? undefined,
    created_at: a.created_at.toISOString(),
    due_date: a.due_date ? a.due_date.toISOString() : undefined,
    assigned_to: a.submissions.map((sa) => ({
      id: sa.student.id,
      full_name: sa.student.user.full_name,
      email: sa.student.user.email,
      username: sa.student.user.username ?? undefined,
      phone: sa.student.user.phone ?? undefined,
      grade_level: sa.student.grade_level ?? undefined,
      enrollment_date: sa.student.enrollment_date.toISOString(),
      progress_score: sa.student.progress_score,
    })),
  }));

  return NextResponse.json({ assignments: mapped });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Parse body safely
  let body: any = null;
  try {
    body = await req.json();
  } catch (_err: unknown) {
    try {
      const txt = await req.text();
      body = txt ? JSON.parse(txt) : null;
    } catch (err2: unknown) {
      console.error("Failed to parse body:", err2 instanceof Error ? err2.message : err2);
      return NextResponse.json(
        { error: "Invalid body", details: err2 instanceof Error ? err2.message : String(err2) },
        { status: 400 }
      );
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
      : studentIds.split(",").map((s: string) => s.trim()).filter(Boolean);
  } catch (err: unknown) {
    studentIds = studentIds.split(",").map((s: string) => s.trim()).filter(Boolean);
  }
}

  if (!Array.isArray(studentIds)) studentIds = body.students ?? body.student_ids ?? [];

  if (!title || studentIds.length === 0) {
    return NextResponse.json({ error: "Title and at least one student required" }, { status: 400 });
  }

  try {
    // Create assignment
    const assignment = await prisma.assignments.create({
      data: {
        title,
        description: description ?? null,
        teacher_id: teacher.id,
        course_id: courseId ?? null,
        due_date: due_date ? new Date(due_date) : null,
      },
    });

    // Create student assignments
    const createManyPayload = studentIds.map((sid: string) => ({
      assignment_id: assignment.id,
      student_id: sid,
    }));

    await prisma.student_assignments.createMany({
      data: createManyPayload,
      skipDuplicates: true,
    });

    // ---------- Notifications ----------
    let students = await prisma.students.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, user_id: true },
    });

    if (!students.length) {
      students = await prisma.students.findMany({
        where: { user_id: { in: studentIds } },
        select: { id: true, user_id: true },
      });
    }

    const notifPayload: { user_id: string; type: string; message: string }[] = students
  .map((s: { user_id: string | null }) => {
    if (!s.user_id) return null;
    return {
      user_id: s.user_id,
      type: "new_assignment",
      message: `A new assignment "${assignment.title}" has been posted for your course.`,
    };
  })
  .filter((s): s is { user_id: string; type: string; message: string } => s !== null);


    if (notifPayload.length) {
      const result = await prisma.notifications.createMany({ data: notifPayload });
      console.log(
        "🔔 Notifications created for assignment",
        assignment.id,
        "count:",
        notifPayload.length,
        "result:",
        result
      );
    } else {
      console.log("🔔 No notifications created. studentIds:", studentIds, "studentsResolved:", students);
    }
    // ----------------------------------

    return NextResponse.json({ id: assignment.id });
  } catch (err: unknown) {
    console.error("Error creating assignment:", err);
    return NextResponse.json(
      { error: "Failed to create assignment", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
