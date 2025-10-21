
// // app/teacher-dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // ✅ use central file, not route
import { redirect } from "next/navigation";
import type { CourseDTO } from "@/lib/types";

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  // ✅ enforce authentication & role
  if (!session || session.user.role !== "teacher") {
    return redirect("/");
  }

  // find teacher record
  const teacher = await prisma.teachers.findUnique({
    where: { user_id: session.user.id },
  });

  if (!teacher) {
    return (
      <div className="p-6">
        Teacher profile not found. Please contact admin.
      </div>
    );
  }

  // courses taught by teacher
  const courses = await prisma.courses.findMany({
    where: { teacher_courses: { some: { teacher_id: teacher.id } } },
    include: { student_courses: { select: { student_id: true } } },
  });

  const totalCourses = courses.length;

  // unique students across all courses
  const studentIds = new Set<string>();
  courses.forEach((c) =>
    c.student_courses.forEach((sc) => studentIds.add(sc.student_id))
  );
  const totalStudents = studentIds.size;

  // assignments pending grading
  const assignmentsPending = await prisma.student_assignments.count({
    where: {
      assignment: { teacher_id: teacher.id },
      grade: null,
      submitted_at: { not: null },
    },
  });

  // certificates issued
  const certificatesIssued = await prisma.certificates.count({
    where: {
      student: {
        student_courses: {
          some: { course: { teacher_courses: { some: { teacher_id: teacher.id } } } },
        },
      },
    },
  });

  // map courses for UI
  const courseList: CourseDTO[] = courses.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    student_count: c.student_courses.length,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students" value={totalStudents} />
        <StatCard label="Total Courses" value={totalCourses} />
        <StatCard label="Assignments Pending Grading" value={assignmentsPending} />
        <StatCard label="Certificates Issued" value={certificatesIssued} />
      </div>

      {/* Courses */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courseList.length > 0 ? (
            courseList.map((c) => (
              <div key={c.id} className="p-4 bg-white rounded shadow">
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-500">
                  {c.description ?? "-"}
                </div>
                <div className="mt-2 text-sm">
                  Enrolled students: {c.student_count}
                </div>
              </div>
            ))
          ) : (
            <div>No courses assigned yet.</div>
          )}
        </div>
      </section>

      {/* Charts */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow">
            [Student progress chart placeholder]
          </div>
          <div className="p-4 bg-white rounded shadow">
            [Submission rate chart placeholder]
          </div>
        </div>
      </section>
    </div>
  );
}

// Small stat card component
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}




