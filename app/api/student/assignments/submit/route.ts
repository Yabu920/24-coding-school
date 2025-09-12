// // app/api/student/assignments/submit/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import path from "path";
// import { promises as fs } from "fs";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const form = await req.formData();
//     const assignmentId = form.get("assignmentId")?.toString();
//     const file = form.get("file") as File | null;
//     if (!assignmentId || !file) return NextResponse.json({ error: "assignmentId and file required" }, { status: 400 });

//     // get student id
//     const student = await prisma.students.findUnique({ where: { user_id: session.user.id } });
//     if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const uploadsDir = path.join(process.cwd(), "public", "submissions");
//     await fs.mkdir(uploadsDir, { recursive: true });
//     const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
//     const filePath = path.join(uploadsDir, safeName);
//     await fs.writeFile(filePath, buffer);
//     const fileUrl = `/submissions/${safeName}`;

//     // create or update student_assignments entry
//     const created = await prisma.student_assignments.upsert({
//       where: { assignment_id_student_id: { assignment_id: assignmentId, student_id: student.id } },
//       update: { submitted_file_url: fileUrl, submitted_at: new Date() },
//       create: { assignment_id: assignmentId, student_id: student.id, submitted_file_url: fileUrl, submitted_at: new Date() }
//     });

//     return NextResponse.json({ success: true, submission: created });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import path from "path";
import { promises as fs } from "fs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const assignmentId = form.get("assignmentId")?.toString();
    const teacherId = form.get("teacherId")?.toString();
    const description = form.get("description")?.toString() || "";
    const file = form.get("file") as File | null;

    if (!assignmentId || !file || !teacherId) {
      return NextResponse.json(
        { error: "assignmentId, teacherId, and file are required" },
        { status: 400 }
      );
    }

    // get student id
    const student = await prisma.students.findUnique({
      where: { user_id: session.user.id },
    });
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "submissions");
    await fs.mkdir(uploadsDir, { recursive: true });
    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/submissions/${safeName}`;

    // create or update student_assignments entry
    const created = await prisma.student_assignments.upsert({
      where: { assignment_id_student_id: { assignment_id: assignmentId, student_id: student.id } },
      update: {
        submitted_file_url: fileUrl,
        description,
        submitted_at: new Date(),
      },
      create: {
        assignment_id: assignmentId,
        student_id: student.id,
        submitted_file_url: fileUrl,
        description,
        submitted_at: new Date(),
      },
    });

    // Optionally, store selected teacher in assignments (if needed)
    await prisma.assignments.update({
      where: { id: assignmentId },
      data: { teacher_id: teacherId },
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: created.id,
        assignment_id: created.assignment_id,
        student_id: created.student_id,
        submitted_file_url: created.submitted_file_url,
        description: created.description,
        submitted_at: created.submitted_at,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
