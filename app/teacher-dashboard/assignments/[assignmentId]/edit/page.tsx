// app/teacher-dashboard/assignments/[assignmentId]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AssignmentEditForm from "../../components/AssignmentEditForm";

export default async function AssignmentEditPage({ params }: { params: { assignmentId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") {
    return <div className="p-6">Access denied</div>;
  }

  const assignment = await prisma.assignments.findUnique({
    where: { id: params.assignmentId },
    include: { course: true },
  });

  if (!assignment) return <div className="p-6">Assignment not found</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Assignment</h1>
      <AssignmentEditForm
  assignment={{
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    file_url: assignment.file_url,
    due_date: assignment.due_date ? assignment.due_date.toISOString().slice(0, 16) : "",
    course_id: assignment.course_id,
  }}
/>

    </div>
  );
}


