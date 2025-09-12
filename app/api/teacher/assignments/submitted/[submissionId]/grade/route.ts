import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { submissionId: string } }) {
  try {
    const { submissionId } = params;
    const body = await req.json();
    const { grade, feedback } = body;

    if (!grade && !feedback) {
      return NextResponse.json({ error: "Grade or feedback required" }, { status: 400 });
    }

    const updated = await prisma.student_assignments.update({
      where: { id: submissionId },
      data: { grade, feedback },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update grade/feedback" }, { status: 500 });
  }
}





// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import path from "path";
// import { writeFile } from "fs/promises";

// export async function GET() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
//   if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

//   const assignments = await prisma.assignments.findMany({
//     where: { teacher_id: teacher.id },
//     include: { submissions: { include: { student: { include: { user: true } } } } },
//     orderBy: { created_at: "desc" },
//   });

//   // map response
//   const payload = assignments.map((a) => ({
//     id: a.id, title: a.title, description: a.description, file_url: a.file_url, created_at: a.created_at, due_date: a.due_date,
//     submissions: a.submissions.map((s) => ({
//       id: s.id, student_id: s.student_id, student_name: s.student.user.full_name, submitted_file_url: s.submitted_file_url, grade: s.grade, feedback: s.feedback, submitted_at: s.submitted_at
//     }))
//   }));

//   return NextResponse.json({ assignments: payload });
// }

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user || session.user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
//   if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

//   const contentType = req.headers.get("content-type") ?? "";
//   let title = "", description = "", due_date: string | null = null, fileUrl: string | null = null;

//   if (contentType.includes("multipart/form-data")) {
//     const form = await req.formData();
//     title = form.get("title")?.toString() ?? "";
//     description = form.get("description")?.toString() ?? "";
//     due_date = form.get("due_date")?.toString() ?? null;
//     const file = form.get("file") as File | null;
//     if (file && file.size > 0) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       const filename = `${Date.now()}-${(file as any).name?.replace(/\s+/g, "-") || "file"}`;
//       const dest = path.join(process.cwd(), "public", "uploads");
//       await writeFile(path.join(dest, filename), buffer).catch(async () => {
//         await import("fs/promises").then(async ({ mkdir }) => {
//           await mkdir(dest, { recursive: true });
//           await writeFile(path.join(dest, filename), buffer);
//         });
//       });
//       fileUrl = `/uploads/${filename}`;
//     }
//   } else {
//     const body = await req.json().catch(() => ({}));
//     title = body.title;
//     description = body.description;
//     due_date = body.due_date ?? null;
//   }

//   if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

//   const assignment = await prisma.assignments.create({
//     data: { title, description, file_url: fileUrl, teacher_id: teacher.id, due_date: due_date ? new Date(due_date) : null },
//   });

//   return NextResponse.json({ assignment });
// }


