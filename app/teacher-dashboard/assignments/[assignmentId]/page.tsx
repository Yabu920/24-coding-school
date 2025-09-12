
// // app/teacher-dashboard/assignments/[assignmentId]/page.tsx
// import { prisma } from "@/lib/prisma";
// import AssignmentSubmissionsClient from "../AssignmentSubmissionClient";

// export default async function AssignmentDetailPage({
//   params,
// }: {
//   params: { assignmentId: string };
// }) {
//   const assignment = await prisma.assignments.findUnique({
//     where: { id: params.assignmentId },
//     include: {
//       submissions: {
//         include: { student: { include: { user: true } } },
//       },
//     },
//   });

//   if (!assignment) return <div className="p-6">Assignment not found</div>;

//   return (
//     <AssignmentSubmissionsClient
//       assignment={{
//         id: assignment.id,
//         title: assignment.title,
//         description: assignment.description,
//         submissions: assignment.submissions.map((s) => ({
//           ...s,
//           submitted_at: s.submitted_at ? s.submitted_at.toISOString() : null,
//         })),
//       }}
//     />
//   );
// }


import { prisma } from "@/lib/prisma";
import AssignmentEditClient from "./AssignmentEditClient";

export default async function AssignmentEditPage({ params }: { params: { assignmentId: string } }) {
  const assignment = await prisma.assignments.findUnique({
    where: { id: params.assignmentId },
  });

  if (!assignment) {
    return <div className="p-6 text-red-600">Assignment not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Edit Assignment</h1>
      <AssignmentEditClient assignment={{
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.due_date ? assignment.due_date.toISOString().split("T")[0] : "",
        file_url: assignment.file_url,
      }} />
    </div>
  );
}

