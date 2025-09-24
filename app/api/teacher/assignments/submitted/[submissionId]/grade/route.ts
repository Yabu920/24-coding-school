// app/api/teacher/assignments/submitted/[submissionId]/grade/route.ts
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
      include:
       {
         student:
          { 
          include: 
            { user: true } },
            assignment: true },
      });
      // fetch submission to get student_id  and add this codes
      const submission = await prisma.student_assignments.findUnique({
        where: { id: submissionId },
        include: { student: true },
      });

    // add codes🔔 notify student
    await prisma.notifications.create({
      data: {
        user_id: updated.student.user_id,
        type: "grade_posted",
        message: `Your assignment "${updated.assignment.title}" was graded: ${grade}. Feedback: ${feedback}`,
        link: `/student-dashboard/assignments/${updated.assignment_id}`,
      },
    });
    // additional notification to student if user_id exists
    if (submission?.student?.user_id) {
  await prisma.notifications.create({
    data: {
      user_id: submission.student.user_id,
      type: "new_grade",
      message: `Your assignment was graded: ${grade ?? "No grade"} - ${feedback ?? ""}`,
    },
  });
}

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update grade/feedback" }, { status: 500 });
  }
}




