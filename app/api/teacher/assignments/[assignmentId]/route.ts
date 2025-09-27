// app/api/teacher/assignments/[assignmentId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile } from "fs/promises";
import path from "path";

export async function DELETE(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "teacher")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  try {
    const assignment = await prisma.assignments.findUnique({
      where: { id: params.assignmentId },
    });

    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    if (assignment.teacher_id !== teacher.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If files are stored under /public/uploads, remove the file (best-effort)
    if (assignment.file_url && typeof assignment.file_url === "string" && assignment.file_url.startsWith("/uploads/")) {
      const fileRelative = assignment.file_url.replace(/^\/+/, ""); // remove leading slash
      const filePath = path.join(process.cwd(), "public", fileRelative);
      try {
        await import("fs/promises").then(async ({ unlink }) => {
          await unlink(filePath);
        });
      } catch (e) {
        // don't fail delete if file is missing — just log
        console.warn("Failed to unlink assignment file:", e);
      }
    }

    await prisma.assignments.delete({
      where: { id: params.assignmentId },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Assignment delete error:", err);
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { assignmentId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "teacher")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

  let title = "";
  let description: string | null = null;
  let due_date: string | null = null;
  let fileUrl: string | null = null;

  const contentType = req.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      title = form.get("title")?.toString() ?? "";
      description = form.get("description")?.toString() ?? null;
      due_date = form.get("due_date")?.toString() ?? null;

      const file = form.get("file") as File | null;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${(file as any).name?.replace(/\s+/g, "-")}`;
        const dest = path.join(process.cwd(), "public", "uploads");
        await import("fs/promises").then(async ({ mkdir }) => {
          await mkdir(dest, { recursive: true });
          await writeFile(path.join(dest, filename), buffer);
        });
        fileUrl = `/uploads/${filename}`;
      }
    } else {
      const body = await req.json();
      title = body.title ?? "";
      description = body.description ?? null;
      due_date = body.due_date ?? null;
      fileUrl = body.file_url ?? null;
    }

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const updated = await prisma.assignments.update({
      where: { id: params.assignmentId },
      data: {
        title,
        description,
        due_date: due_date ? new Date(due_date) : null,
        file_url: fileUrl,
        teacher_id: teacher.id,
      },
    });



    return NextResponse.json({ assignment: updated });
  } catch (err: any) {
    console.error("Assignment update error:", err);
    return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
  }
}

