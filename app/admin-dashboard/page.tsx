

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import AdminPortal from "@/components/admin/admin-portal";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  const totalStudents = await prisma.users.count({ where: { role: "student" } });
  const activeStudents = await prisma.users.count({ where: { role: "student", status: "active" } });
  const totalTeachers = await prisma.users.count({ where: { role: "teacher" } });

  let totalCourses = 0;
  try {
    totalCourses = await prisma.courses.count();
  } catch (e) {
    console.warn("Courses table does not exist yet");
  }

  const studentLevels = await prisma.students.groupBy({
    by: ["grade_level"],
    _count: { grade_level: true },
  });

  const registrations = await prisma.users.findMany({
    where: { role: "student" },
    orderBy: { created_at: "asc" },
    select: { created_at: true },
  });

  return (
    <AdminPortal
      stats={{ totalStudents, activeStudents, totalTeachers, totalCourses }}
      studentLevels={studentLevels}
      registrations={registrations}
    />
  );
}
