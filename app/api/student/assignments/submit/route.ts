
// app/api/student/assignments/submit/route.ts
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
    const teacherIdRaw = form.get("teacherId")?.toString();
    const description = form.get("description")?.toString() || "";
    const file = form.get("file") as File | null;

    if (!assignmentId || !file || !teacherIdRaw) {
      return NextResponse.json(
        { error: "assignmentId, teacherId, and file are required" },
        { status: 400 }
      );
    }

    // get student record (with user info for notification message)
    const student = await prisma.students.findUnique({
      where: { user_id: session.user.id },
      include: { user: true },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Save file to /public/submissions
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), "public", "submissions");
    await fs.mkdir(uploadsDir, { recursive: true });
    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/submissions/${safeName}`;

    // create or update student_assignments entry
    const created = await prisma.student_assignments.upsert({
      where: {
        assignment_id_student_id: {
          assignment_id: assignmentId,
          student_id: student.id,
        },
      },
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

    // update assignments.teacher_id (keep as-is if same)
    // teacherIdRaw might be teachers.id or users.id; we'll attempt both below
    let teacherRecord = null;
    // try treat teacherIdRaw as teachers.id first
    teacherRecord = await prisma.teachers.findUnique({ where: { id: teacherIdRaw } });

    if (!teacherRecord) {
      // maybe the client passed the teacher's user id — find teacher by user_id
      teacherRecord = await prisma.teachers.findUnique({ where: { user_id: teacherIdRaw } });
    }

    // If we found a teacher record and its id differs from assignment.teacher_id, update assignment
    if (teacherRecord) {
      try {
        await prisma.assignments.update({
          where: { id: assignmentId },
          data: { teacher_id: teacherRecord.id },
        });
      } catch (err) {
        // non-fatal: log and continue
        console.error("Failed to update assignment teacher_id:", err);
      }
    } else {
      console.warn("Teacher not found for provided teacherId:", teacherIdRaw);
    }

    // Notify teacher (use teacherRecord.user_id which is a users.id)
    if (teacherRecord?.user_id) {
      try {
        await prisma.notifications.create({
          data: {
            user_id: teacherRecord.user_id, // users.id (receiver)
            type: "assignment_submitted",
            message: `${student.user?.full_name ?? "A student"} submitted assignment ${assignmentId}`,
            link: `/teacher-dashboard/assignments/${assignmentId}/submissions`,
          },
        });
      } catch (err) {
        // don't fail the whole response if notification creation fails
        console.error("Failed to create notification for teacher:", err);
      }
    }

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
    console.error("Submit assignment error:", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

