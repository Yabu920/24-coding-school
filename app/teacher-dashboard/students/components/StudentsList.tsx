
"use client"

import { useMemo, useState } from "react"
import type { Course, Student } from "@/types"

type Props = { initialCourses: Course[] }

export default function StudentsList({ initialCourses }: Props) {
  const [courseId, setCourseId] = useState<string>("all")
  const [search, setSearch] = useState("")

  const allStudents = useMemo<Student[]>(() => {
    return initialCourses.flatMap((c) =>
      c.students.map((s) => ({ ...s, courseName: c.name }))
    )
  }, [initialCourses])

  const filtered = useMemo<Student[]>(() => {
    const base =
      courseId === "all"
        ? allStudents
        : allStudents.filter((s) =>
            initialCourses.some((c) => c.id === courseId && c.name === s.courseName)
          )

    const q = search.trim().toLowerCase()
    if (!q) return base
    return base.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.username?.toLowerCase().includes(q) ?? false)
    )
  }, [allStudents, courseId, search, initialCourses])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Students</h1>
        <div className="flex gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="all">All Courses</option>
            {initialCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Search name, email, username…"
            className="border rounded-lg px-3 py-2 w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((s) => (
              <tr key={`${s.id}-${s.courseName}`}>
                <td className="px-4 py-3">
                  <div className="font-medium">{s.full_name}</div>
                  <div className="text-sm text-gray-500">{s.username ?? "—"}</div>
                </td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.courseName ?? "—"}</td>
                <td className="px-4 py-3">{s.grade_level ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="w-40 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(0, s.progress_score))}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  {new Date(s.enrollment_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
