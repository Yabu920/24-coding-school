// import { prisma } from "@/lib/prisma";
// import SubmittedAssignmentClient from "./SubmittedAssignmentClient";

// interface PageProps {
//   params: { submissionId: string };
// }

// export default async function SubmittedAssignmentPage({ params }: PageProps) {
//   const { submissionId } = params;

//   const submission = await prisma.student_assignments.findUnique({
//     where: { id: submissionId },
//     include: {
//       student: { include: { user: true } },
//       assignment: true,
//     },
//   });

//   if (!submission) return <div>Submission not found</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Submitted Assignment</h1>
//       <SubmittedAssignmentClient submission={submission} />
//     </div>
//   );
// }


// server component - app/teacher-dashboard/assignments/submitted/[submissionId]/page.tsx
import { prisma } from "@/lib/prisma";
import SubmittedAssignmentClient from "./SubmittedAssignmentClient";

interface Props {
  params: { submissionId: string };
}

export default async function SubmittedAssignmentPage({ params }: Props) {
  const { submissionId } = params;

  // fetch the single submission by id
  const rawSubmission = await prisma.student_assignments.findUnique({
  where: { id: submissionId },
  include: {
    student: { include: { user: true } },
    assignment: {
      include: { teacher: { include: { user: true } }, course: true },
    },
  },
});

if (!rawSubmission) {
  return <div className="p-6 text-red-600">Submission not found.</div>;
}

// convert Date fields to string for client-safe props
const submission = {
  ...rawSubmission,
  submitted_at: rawSubmission.submitted_at
    ? rawSubmission.submitted_at.toISOString()
    : null,
  assignment: {
    ...rawSubmission.assignment,
    course:
      rawSubmission.assignment.course === null
        ? undefined
        : { name: rawSubmission.assignment.course?.name ?? null },
  },
};


  // pass the submission to a client component for interactivity
  return (
    <div className="p-6">
      <SubmittedAssignmentClient submission={submission} />
    </div>
  );
}
