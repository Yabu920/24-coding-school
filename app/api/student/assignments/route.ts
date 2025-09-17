// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// // TypeScript types for API response
// type Submission = {
//   submittedFileUrl?: string;
//   grade: string | null;
//   feedback: string | null;
//   submittedAt: string | null;
// };

// type AssignmentResponse = {
//   id: string;
//   title: string;
//   description: string | null;
//   fileUrl?: string;
//   dueDate: string | null;
//   createdAt: string;
//   teacherName: string;
//   courseName: string;
//   submission: Submission | null;
// };

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "student") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Find the student by user ID and include enrolled courses
//     const student = await prisma.students.findUnique({
//       where: { user_id: session.user.id },
//       include: { student_courses: true },
//     });

//     if (!student) {
//       return NextResponse.json({ assignments: [] });
//     }

//     const courseIds = student.student_courses.map(sc => sc.course_id);

//     // Fetch assignments for these courses
//     const assignments = await prisma.assignments.findMany({
//       where: { course_id: { in: courseIds } },
//       include: {
//         teacher: { include: { user: true } },
//         course: true, // course relation may be null, so we handle safely
//         submissions: { where: { student_id: student.id } },
//       },
//       orderBy: { created_at: "desc" },
//     });

//     // Map to API-friendly format
//     const result: AssignmentResponse[] = assignments.map(a => {
//       const submission = a.submissions[0]
//         ? {
//             submittedFileUrl: a.submissions[0].submitted_file_url || undefined,
//             grade: a.submissions[0].grade || null,
//             feedback: a.submissions[0].feedback || null,
//             submittedAt: a.submissions[0].submitted_at
//               ? a.submissions[0].submitted_at.toISOString()
//               : null,
//           }
//         : null;

//       return {
//         id: a.id,
//         title: a.title,
//         description: a.description || null,
//         fileUrl: a.file_url || undefined,
//         dueDate: a.due_date ? a.due_date.toISOString() : null,
//         createdAt: a.created_at.toISOString(),
//         teacherName: a.teacher?.user?.full_name || "Unknown Teacher",
//         courseName: a.course?.name || "Unknown Course",
//         submission,
//       };
//     });

//     return NextResponse.json({ assignments: result });
//   } catch (err) {
//     console.error("❌ Error fetching assignments:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch assignments" },
//       { status: 500 }
//     );
//   }
// }










// // app/api/student/assignments/route.ts
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export type AssignmentResponse = {
//   id: string;
//   title: string;
//   description: string | null;
//   fileUrl?: string;
//   dueDate: string | null;
//   createdAt: string;
//   teacherName: string;
//   courseName: string;
//   submission:
//     | {
//         submittedFileUrl?: string;
//         grade: string | null;
//         feedback: string | null;
//         submittedAt: string | null;
//       }
//     | null;
// };

// // GET /api/student/assignments
// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "student") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Find the student
//     const student = await prisma.students.findUnique({
//       where: { user_id: session.user.id },
//       include: { student_courses: true },
//     });

//     if (!student) {
//       return NextResponse.json({ assignments: [] });
//     }

//     const courseIds = student.student_courses.map(sc => sc.course_id);

//     // Fetch assignments for these courses
//     const assignments = await prisma.assignments.findMany({
//       where: { course_id: { in: courseIds } },
//       include: {
//         teacher: { include: { user: true } },
//         course: true,
//         submissions: { where: { student_id: student.id } },
//       },
//       orderBy: { created_at: "desc" },
//     });

//     // Map assignments to response
//     const result: AssignmentResponse[] = assignments.map(a => {
//       const submission = a.submissions[0]
//         ? {
//             submittedFileUrl: a.submissions[0].submitted_file_url || undefined,
//             grade: a.submissions[0].grade || null,
//             feedback: a.submissions[0].feedback || null,
//             submittedAt: a.submissions[0].submitted_at
//               ? a.submissions[0].submitted_at.toISOString()
//               : null,
//           }
//         : null;

//       return {
//         id: a.id,
//         title: a.title,
//         description: a.description || null,
//         fileUrl: a.file_url || undefined,
//         dueDate: a.due_date ? a.due_date.toISOString() : null,
//         createdAt: a.created_at.toISOString(),
//         teacherName: a.teacher?.user?.full_name || "Unknown Teacher",
//         courseName: a.course?.name || "Unknown Course",
//         submission,
//       };
//     });

//     return NextResponse.json({ assignments: result });
//   } catch (err) {
//     console.error("❌ Error fetching assignments:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch assignments" },
//       { status: 500 }
//     );
//   }
// }

// // POST /api/student/assignments/submit
// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "student") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await req.formData();
//     const assignmentId = formData.get("assignmentId")?.toString();
//     const file = formData.get("file") as File | null;

//     if (!assignmentId || !file) {
//       return NextResponse.json(
//         { error: "Assignment ID and file are required" },
//         { status: 400 }
//       );
//     }

//     const student = await prisma.students.findUnique({
//       where: { user_id: session.user.id },
//     });

//     if (!student) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 });
//     }

//     // Save file to public folder
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filePath = `/assignments/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
//     const fs = await import("fs/promises");
//     const path = await import("path");
//     const uploadsDir = path.join(process.cwd(), "public/assignments");
//     await fs.mkdir(uploadsDir, { recursive: true });
//     await fs.writeFile(path.join(uploadsDir, filePath.split("/").pop()!), buffer);

//     // Create or update submission
//     const submission = await prisma.student_assignments.upsert({
//       where: {
//         assignment_id_student_id: {
//           assignment_id: assignmentId,
//           student_id: student.id,
//         },
//       },
//       update: {
//         submitted_file_url: filePath,
//         submitted_at: new Date(),
//       },
//       create: {
//         assignment_id: assignmentId,
//         student_id: student.id,
//         submitted_file_url: filePath,
//         submitted_at: new Date(),
//       },
//     });

//     return NextResponse.json({ submission });
//   } catch (err) {
//     console.error("❌ Error submitting assignment:", err);
//     return NextResponse.json(
//       { error: "Failed to submit assignment" },
//       { status: 500 }
//     );
//   }
// }


//app/api/student/assignments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get student ID
    const student = await prisma.students.findUnique({
      where: { user_id: session.user.id },
    });
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // Fetch all assignments for courses student is enrolled in
    const assignments = await prisma.assignments.findMany({
      where: {
        course: {
          student_courses: {
            some: { student_id: student.id },
          },
        },
      },
      include: {
        submissions: {
          where: { student_id: student.id },
        },
        teacher: {
          include: { user: true },
        },
      },
      orderBy: { due_date: "asc" },
    });

    const formatted = assignments.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      file_url: a.file_url,
      due_date: a.due_date?.toISOString(),
      submitted: a.submissions.length > 0,
      submission_id: a.submissions[0]?.id,
      submitted_file_url: a.submissions[0]?.submitted_file_url,
      grade: a.submissions[0]?.grade,
      feedback: a.submissions[0]?.feedback,
      teacher_name: a.teacher.user.full_name,
    }));

    return NextResponse.json({ assignments: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}
