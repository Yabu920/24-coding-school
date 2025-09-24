import { prisma } from "@/lib/prisma";

export default async function AssignmentDetail({ params }: { params: { id: string } }) {
  const assignment = await prisma.assignments.findUnique({
    where: { id: params.id },
    include: { teacher: true, course: true },
  });

  if (!assignment) {
    return <p>Assignment not found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{assignment.title}</h1>
      <p className="text-gray-700">{assignment.description}</p>
      {assignment.file_url && (
        <a
          href={assignment.file_url}
          target="_blank"
          className="text-blue-600 underline mt-2 block"
        >
          Download File
        </a>
      )}
      <p className="mt-4 text-sm text-gray-500">
        Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}
      </p>
    </div>
  );
}
