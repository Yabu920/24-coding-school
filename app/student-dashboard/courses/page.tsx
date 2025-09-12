// app/student-dashboard/courses/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") return <div>Access denied</div>;

  const student = await prisma.students.findUnique({ where: { user_id: session.user.id }});
  const courses = await prisma.courses.findMany({
    where: { student_courses: { some: { student_id: student?.id } } },
    select: {
      id: true,
      name: true,
      description: true,
      teacher_courses: { select: { teacher: { select: { user: { select: { full_name: true } } } } } },
    }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-600">{c.description ?? "No description"}</p>
            <div className="mt-3 text-sm text-gray-700">
              Teacher: {c.teacher_courses.map(tc => tc.teacher.user.full_name).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
