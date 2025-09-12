// app/teacher-dashboard/classes/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ClassesManager from "./components/ClassesManager";

export default async function ClassesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "teacher") return redirect("/login");

  // find teacher record
  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } });
  if (!teacher) return <div className="p-6">No teacher profile found.</div>;

  // fetch teacher's courses with student count
  const courses = await prisma.courses.findMany({
    where: { teacher_courses: { some: { teacher_id: teacher.id } } },
    include: { student_courses: { select: { student_id: true } } },
    orderBy: { name: "asc" },
  });

  const payload = courses.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    student_count: c.student_courses.length,
  }));

  // Pass as JSON to client manager
  return <ClassesManager initialCourses={payload} />;
}
