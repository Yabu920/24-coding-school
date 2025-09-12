// server component
import { prisma } from "@/lib/prisma";
import EditAssignmentClient from "../../../[assignmentId]/EditAssignmentClient";

interface Props {
  params: { assignmentId: string };
}

export default async function EditAssignmentPage({ params }: Props) {
  const assignment = await prisma.assignments.findUnique({
    where: { id: params.assignmentId },
    include: { course: true },
  });

  if (!assignment) return <div className="p-6">Assignment not found.</div>;

  return <EditAssignmentClient assignment={assignment} />;
}
