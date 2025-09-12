
// app/student-dashboard/assignments/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import StudentAssignmentsList from "./components/StudentAssignmentsList";

export default async function StudentAssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") return <div>Access denied</div>;

  const student = await prisma.students.findUnique({ where: { user_id: session.user.id } });
  if (!student) return <div>No student found</div>;

  // Fetch all assignments for this student
  const studentAssignments = await prisma.assignments.findMany({
    where: {
      course: {
        student_courses: { some: { student_id: student.id } },
      },
    },
    include: {
      submissions: {
        where: { student_id: student.id },
      },
    },
    orderBy: { created_at: "desc" },
  });

  // Map to front-end type
  const assignments = studentAssignments.map((a) => {
    const submission = a.submissions[0]; // student can have at most one submission
    return {
      id: a.id,
      title: a.title,
      description: a.description ?? undefined,
      file_url: a.file_url ?? undefined,
      due_date: a.due_date?.toISOString() ?? undefined,
      submitted: !!submission,
      submission_id: submission?.id,
      submitted_file_url: submission?.submitted_file_url ?? undefined,
      grade: submission?.grade ?? null,
      feedback: submission?.feedback ?? null,
    };
  });

  return <StudentAssignmentsList assignments={assignments} studentId={student.id} />;
}



