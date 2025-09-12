"use client"

import { useMemo, useState } from "react"
import type { Course, Student, Certificate } from "@/types"

type Props = {
  courses: Course[]
  certificates: Certificate[]
}

export default function IssueCertificates({ courses, certificates }: Props) {
  const [courseId, setCourseId] = useState<string>(courses[0]?.id ?? "")
  const [studentId, setStudentId] = useState<string>("")
  const [fileUrl, setFileUrl] = useState<string>("")
  const [issuing, setIssuing] = useState(false)

  const currentCourse = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courseId, courses]
  )
  const students: Student[] = currentCourse?.students ?? []

  const issue = async () => {
    if (!courseId || !studentId) {
      alert("Select course and student.")
      return
    }
    setIssuing(true)
    try {
      const res = await fetch("/api/teacher/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          courseName: currentCourse?.name,
          file_url: fileUrl || undefined,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || "Failed to issue certificate")
      }
      alert("Certificate issued.")
      setFileUrl("")
      setStudentId("")
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIssuing(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Certificates</h1>
        <p className="text-gray-500">Issue and review certificates.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Issue Certificate</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Course</label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value)
                setStudentId("")
              }}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Student</label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              <option value="">Select student…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">File URL (optional)</label>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              placeholder="https://…"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={issue}
            disabled={issuing}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {issuing ? "Issuing…" : "Issue Certificate"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="px-5 py-3 border-b">
          <span className="font-medium">Recent Certificates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Issued At</th>
                <th className="px-4 py-3">File</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {certificates.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3">{c.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">{c.courseName}</td>
                  <td className="px-4 py-3">
                    {new Date(c.issued_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {c.file_url ? (
                      <a
                        className="text-blue-600 hover:underline"
                        href={c.file_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    No certificates issued yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
