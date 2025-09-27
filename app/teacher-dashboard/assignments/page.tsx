
// // app/teacher-dashboard/assignments/page.tsx
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import Link from "next/link";
// import CreateAssignmentForm from "./components/CreateAssignmentForm";

// export default async function TeacherAssignmentsPage() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "teacher") return <div className="p-6">Access denied</div>;

//   const teacher = await prisma.teachers.findUnique({
//     where: { user_id: session.user.id },
//   });
//   if (!teacher) return <div className="p-6">Teacher profile not found</div>;

//   // teacher's courses for the create form
//   const teacherCourses = await prisma.teacher_courses.findMany({
//     where: { teacher_id: teacher.id },
//     include: { course: true },
//   });

//   // assignments created by this teacher (include submissions count)
//   const assignments = await prisma.assignments.findMany({
//     where: { teacher_id: teacher.id },
//     include: { submissions: true },
//     orderBy: { created_at: "desc" },
//   });

//   // recently submitted assignments for this teacher's assignments
//   const submissions = await prisma.student_assignments.findMany({
//     where: {
//       assignment: { teacher_id: teacher.id },
//       submitted_at: { not: null },
//     },
//     include: {
//       student: { include: { user: true } },
//       assignment: true,
//     },
//     orderBy: { submitted_at: "desc" },
//   });

//   return (
//     <div className="p-6 space-y-8">
//       <h1 className="text-3xl font-bold">Assignments</h1>

//       {/* CREATE ASSIGNMENT */}
//       <section className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
//         <CreateAssignmentForm
//           // pass available courses for teacher (optional)
//           courses={teacherCourses.map((tc) => ({ id: tc.course.id, name: tc.course.name }))}
//         />
//       </section>

//       {/* CREATED ASSIGNMENTS */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
//         {assignments.length === 0 ? (
//           <div className="text-sm text-gray-600">No assignments created yet.</div>
//         ) : (
//           <div className="grid gap-4">
//             {assignments.map((a) => (
//               <div key={a.id} className="p-4 border rounded shadow-sm flex justify-between items-center">
//                 <div>
//                   <div className="font-semibold">{a.title}</div>
//                   {a.description && <div className="text-gray-600">{a.description}</div>}
//                   {a.due_date && <div className="text-sm text-gray-500">Due: {new Date(a.due_date).toLocaleString()}</div>}
//                   <div className="text-sm text-gray-500 mt-1">{a.submissions?.length ?? 0} submission(s)</div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Link href={`/teacher-dashboard/assignments/${a.id}/edit`} className="px-3 py-1 bg-blue-600 text-white rounded">
//                     Edit
//                   </Link>
//                   <Link href={`/teacher-dashboard/assignments/${a.id}`} className="px-3 py-1 bg-gray-100 text-gray-800 rounded">
//                     View
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* SUBMITTED ASSIGNMENTS */}
//       <section>
//         <h2 className="text-xl font-semibold mb-4">Submitted Assignments</h2>
//         {submissions.length === 0 ? (
//           <div className="text-sm text-gray-600">No submissions yet.</div>
//         ) : (
//           <div className="overflow-x-auto bg-white rounded shadow">
//             <table className="min-w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Assignment</th>
//                   <th className="px-4 py-2 text-left">Student</th>
//                   <th className="px-4 py-2 text-left">Submitted At</th>
//                   <th className="px-4 py-2 text-left">Grade</th>
//                   <th className="px-4 py-2 text-left">Feedback</th>
//                   <th className="px-4 py-2 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {submissions.map((s) => (
//                   <tr key={s.id} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-3">{s.assignment.title}</td>
//                     <td className="px-4 py-3">{s.student.user.full_name}</td>
//                     <td className="px-4 py-3">{s.submitted_at ? new Date(s.submitted_at).toLocaleString() : "-"}</td>
//                     <td className="px-4 py-3">{s.grade ?? "-"}</td>
//                     <td className="px-4 py-3">{s.feedback ?? "-"}</td>
//                     <td className="px-4 py-3">
//                       <Link href={`/teacher-dashboard/assignments/submitted/${s.id}`} className="px-3 py-1 bg-green-600 text-white rounded">
//                         Grade
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }



// app/teacher-dashboard/assignments/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import CreateAssignmentForm from "./components/CreateAssignmentForm";
import TeacherAssignmentsClient from "./components/TeacherAssignmentsClient";

export default async function TeacherAssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") {
    return <div className="p-6">Access denied</div>;
  }

  const teacher = await prisma.teachers.findUnique({
    where: { user_id: session.user.id },
  });

  if (!teacher) return <div className="p-6">Teacher profile not found</div>;

  // Teacher's courses
  const teacherCourses = await prisma.teacher_courses.findMany({
    where: { teacher_id: teacher.id },
    include: { course: true },
  });

  // Assignments created by this teacher
  const assignments = await prisma.assignments.findMany({
    where: { teacher_id: teacher.id },
    include: { submissions: true },
    orderBy: { created_at: "desc" },
  });

  // Submissions
  const submissions = await prisma.student_assignments.findMany({
    where: {
      assignment: { teacher_id: teacher.id },
      submitted_at: { not: null },
    },
    include: {
      student: { include: { user: true } },
      assignment: true,
    },
    orderBy: { submitted_at: "desc" },
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Assignments</h1>

      {/* Create Assignment Form */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
        <CreateAssignmentForm
          courses={teacherCourses.map((tc) => ({
            id: tc.course.id,
            name: tc.course.name,
          }))}
        />
      </section>

      {/* Client component handles filters and lists */}
      <TeacherAssignmentsClient
        assignments={assignments}
        submissions={submissions}
      />
    </div>
  );
}
