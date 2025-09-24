// app/api/teacher/assignments/[assignmentId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile } from "fs/promises";
import path from "path";

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
