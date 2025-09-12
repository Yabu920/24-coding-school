// app/teacher-dashboard/assignments/submitted/page.tsx
import { prisma } from "@/lib/prisma";

export default async function SubmittedAssignmentsPage() {
  // Fetch all submitted assignments
  const submissions = await prisma.student_assignments.findMany({
    where: { submitted_at: { not: null } },
    include: {
      assignment: {
        include: { teacher: { include: { user: true } }, course: true },
      },
      student: {
        include: { user: true },
      },
    },
    orderBy: { submitted_at: "desc" },
  });

  if (submissions.length === 0) {
    return <div className="p-6">No assignments have been submitted yet.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Submitted Assignments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Student</th>
              <th className="px-4 py-2 border">Assignment</th>
              <th className="px-4 py-2 border">Course</th>
              <th className="px-4 py-2 border">Teacher</th>
              <th className="px-4 py-2 border">Submitted At</th>
              <th className="px-4 py-2 border">Grade</th>
              <th className="px-4 py-2 border">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-2 border">
                    <a href={`/teacher-dashboard/assignments/submitted/${s.id}`} className="text-blue-600 hover:underline">
                    {s.student.user.full_name}
                    </a>
                </td>
                <td className="px-4 py-2 border">{s.assignment.title}</td>
                <td className="px-4 py-2 border">{s.assignment.course?.name ?? "-"}</td>
                <td className="px-4 py-2 border">{s.assignment.teacher.user.full_name}</td>
                <td className="px-4 py-2 border">{s.submitted_at?.toLocaleString()}</td>
                <td className="px-4 py-2 border">{s.grade ?? "-"}</td>
                <td className="px-4 py-2 border">{s.feedback ?? "-"}</td>
                </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
