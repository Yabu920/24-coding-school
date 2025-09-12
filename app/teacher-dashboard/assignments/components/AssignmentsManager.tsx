// app/teacher-dashboard/assignments/components/AssignmentsManager.tsx
"use client"

import { useMemo, useState } from "react"
import type { Assignment, Course, Student, Submission } from "@/types"

type Props = {
  courses: Course[]
  initialAssignments: Assignment[]
}

export default function AssignmentsManager({ courses, initialAssignments }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [courseId, setCourseId] = useState<string>(courses[0]?.id ?? "")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [dueDate, setDueDate] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [q, setQ] = useState("")

  const courseStudents: Student[] = useMemo(() => {
    const c = courses.find((x) => x.id === courseId)
    return c?.students ?? []
  }, [courseId, courses])

  const filteredAssignments = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return assignments
    return assignments.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        (a.description?.toLowerCase().includes(term) ?? false)
    )
  }, [assignments, q])

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const createAssignment = async () => {
    if (!title || selectedStudents.length === 0) {
      alert("Title and at least one student are required.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          due_date: dueDate || undefined,
          studentIds: selectedStudents,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to create assignment")
      }
      // reload list
      const refreshed = await fetch("/api/teacher/assignments").then((r) => r.json())
      setAssignments(refreshed.assignments)
      // reset form
      setTitle("")
      setDescription("")
      setSelectedStudents([])
      setDueDate("")
      alert("Assignment created.")
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Assignments</h1>
          <p className="text-gray-500">
            Create and manage assignments for your active students.
          </p>
        </div>
        <input
          className="border rounded-lg px-3 py-2 w-full md:w-80"
          placeholder="Search assignments…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Create Assignment Form */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Create Assignment</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Title</label>
            <input
              className="border rounded-lg px-3 py-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Arrays Practice"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Course</label>
            <select
              className="border rounded-lg px-3 py-2 w-full"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-gray-600">Description (optional)</label>
            <textarea
              className="border rounded-lg px-3 py-2 w-full min-h-[96px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details or instructions…"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Due date (optional)</label>
            <input
              type="datetime-local"
              className="border rounded-lg px-3 py-2 w-full"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Assign to (active students)</label>
            <div className="border rounded-lg p-3 max-h-48 overflow-auto">
              {courseStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                  />
                  <span className="text-sm">
                    {s.full_name} <span className="text-gray-500">({s.email})</span>
                  </span>
                </label>
              ))}
              {courseStudents.length === 0 && (
                <div className="text-sm text-gray-500">
                  No active students in this course.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={createAssignment}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create Assignment"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-5 py-3 border-b">
          <span className="font-medium">Recent Assignments</span>
        </div>
        <ul className="divide-y">
          {filteredAssignments.map((a) => (
            <li key={a.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{a.title}</div>
                  {a.description && (
                    <div className="text-gray-600 mt-1">{a.description}</div>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    Assigned to:{" "}
                    {a.assigned_to.map((s: Student) => s.full_name).join(", ") || "—"}
                  </div>

                  {/* Submissions List */}
                  {/* Submissions List */}
                  {a.submissions && a.submissions.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                  <h3 className="font-medium text-sm mb-2">Submissions</h3>
                  <ul className="space-y-2">
                    {a.submissions.map((s: Submission) => (
                      <li
                        key={s.id}
                        className="p-3 border rounded bg-gray-50"
                      >
                        <p className="font-medium">{s.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {s.submittedAt
                            ? `Submitted at: ${new Date(s.submittedAt).toLocaleString()}`
                            : "Not submitted yet"}
                        </p>
                        {s.description && (
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">Answer:</span> {s.description}
                          </p>
                        )}
                        {s.submittedFile && (
                          <a
                            href={s.submittedFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm mt-1 inline-block"
                          >
                            View File
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                  </div>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Created: {new Date(a.created_at).toLocaleString()}</div>
                  <div>
                    Due:{" "}
                    {a.due_date
                      ? new Date(a.due_date).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>
            </li>
          ))}
          {filteredAssignments.length === 0 && (
            <li className="p-10 text-center text-gray-500">No assignments</li>
          )}
        </ul>
      </div>
    </div>
  )
}








