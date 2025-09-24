// app/api/teacher/assignments/[assignmentId]/Submissions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: Request, { params }: { params: { assignmentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
    if (!teacher) return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });

    const body = await req.json();
    const { title, description, dueDate } = body;

    // ensure teacher owns this assignment
    const existing = await prisma.assignments.findUnique({ where: { id: params.assignmentId } });
    if (!existing) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    if (existing.teacher_id !== teacher.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await prisma.assignments.update({
      where: { id: params.assignmentId },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        due_date: dueDate ? new Date(dueDate) : existing.due_date,
      },
    });

    return NextResponse.json({ success: true, assignment: updated });
  } catch (err) {
    console.error("Assignment update error:", err);
    return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
  }
}


