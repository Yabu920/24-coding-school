
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

  // Courses taught by this teacher
  const teacherCourses = await prisma.teacher_courses.findMany({
    where: { teacher_id: teacher.id },
    include: { course: true },
  });

  // ✅ Assignments created by this teacher
  const assignments = (
    await prisma.assignments.findMany({
      where: { teacher_id: teacher.id },
      include: { submissions: true },
      orderBy: { created_at: "desc" },
    })
  ).map((a) => ({
    ...a,
    created_at: a.created_at.toISOString(),
    due_date: a.due_date ? a.due_date.toISOString() : null,
  }));

  // ✅ Submissions for those assignments, shaped for TeacherAssignmentsClient
  // Fetch submissions for assignments by this teacher
const submissions = (
  await prisma.student_assignments.findMany({
    where: {
      submitted_at: { not: null },
      assignment: {
        teacher_id: teacher.id, // ✅ only works if assignment relation exists
      },
    },
    include: {
      student: { include: { user: true } },
      assignment: true,
    },
    orderBy: { submitted_at: "desc" },
  })
).map((s) => ({
  id: s.id,
  submitted_at: s.submitted_at?.toISOString() ?? null,
  submitted_file_url: s.submitted_file_url,
  grade: s.grade,
  feedback: s.feedback,
  student: {
    id: s.student.id,
    user: {
      full_name: s.student.user.full_name,
      email: s.student.user.email,
    },
  },
  assignment: {
    id: s.assignment.id,
    title: s.assignment.title,
    created_at: s.assignment.created_at.toISOString(),
    due_date: s.assignment.due_date?.toISOString() ?? null,
  },
}));


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

      {/* Client handles filters, lists, delete, view */}
      <TeacherAssignmentsClient
        assignments={assignments}
        submissions={submissions}
      />
    </div>
  );
}

