
// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/authOptions"
// import { prisma } from "@/lib/prisma"
// import type { Course, Student } from "@/types"
// import StudentsList from "./components/StudentsList"

// export default async function StudentsPage() {
//   const session = await getServerSession(authOptions)
//   if (!session || session.user.role !== "teacher") redirect("/login")

//   // find teacher row
//   const teacher = await prisma.teachers.findUnique({
//     where: { user_id: session.user.id },
//   })
//   if (!teacher) redirect("/login")

//   const teacherCourses = await prisma.teacher_courses.findMany({
//     where: { teacher_id: teacher.id },
//     include: {
//       course: {
//         include: {
//           student_courses: {
//             include: {
//               student: {
//                 include: {
//                   user: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   })

//   const courses: Course[] = teacherCourses.map((tc) => ({
//     id: tc.course.id,
//     name: tc.course.name,
//     description: tc.course.description ?? undefined,
//     students: tc.course.student_courses.map((sc) => ({
//       id: sc.student.id,
//       full_name: sc.student.user.full_name,
//       email: sc.student.user.email,
//       username: sc.student.user.username ?? undefined,
//       phone: sc.student.user.phone ?? undefined,
//       grade_level: sc.student.grade_level ?? undefined,
//       enrollment_date: sc.student.enrollment_date.toISOString(),
//       progress_score: sc.student.progress_score,
//       courseName: tc.course.name,
//     })),
//   }))

//   return <StudentsList initialCourses={courses} />
// }


// app/teacher-dashboard/students/page.tsx
"use client";

import { useEffect, useState } from "react";

type Course = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  grade_level?: string | null;
  enrollment_date: string;
  progress_score: number;
  courses: Course[];
};

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 15;

  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const res = await fetch("/api/teacher/students");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();

        setStudents(data.students);

        // Extract unique courses for filter
        const coursesMap: Record<string, Course> = {};
        data.students.forEach((s: Student) => {
          s.courses.forEach((c) => {
            coursesMap[c.id] = c;
          });
        });
        setAllCourses(Object.values(coursesMap));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndCourses();
  }, []);

  // Filtered students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesCourse =
      courseFilter === "all" ||
      student.courses.some((c) => c.id === courseFilter);

    return matchesSearch && matchesCourse;
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Students List</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Courses</option>
          {allCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : currentStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Full Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Grade Level</th>
                <th className="px-4 py-2 text-left">Courses</th>
                <th className="px-4 py-2 text-left">Enrollment Date</th>
                <th className="px-4 py-2 text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, idx) => (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{startIndex + idx + 1}</td>
                  <td className="px-4 py-2">{student.full_name}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.phone || "-"}</td>
                  <td className="px-4 py-2">{student.grade_level || "-"}</td>
                  <td className="px-4 py-2">
                    {student.courses.map((c) => c.name).join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(student.enrollment_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{student.progress_score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
