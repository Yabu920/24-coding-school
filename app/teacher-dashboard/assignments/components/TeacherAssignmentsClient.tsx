
// app/teacher-dashboard/assignments/components/TeacherAssignmentsClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type AssignmentIn = {
  id: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  due_date?: string | null;
  created_at: string;
  submissions?: Array<any>;
};

type SubmissionIn = {
  id: string;
  assignment: { id: string; title: string; due_date?: string | null; created_at?: string };
  student: { id: string; user: { full_name?: string; email?: string } };
  submitted_at?: string | null;
  submitted_file_url?: string | null;
  grade?: string | null;
  feedback?: string | null;
};

export default function TeacherAssignmentsClient({
  assignments = [],
  submissions = [],
}: {
  assignments?: AssignmentIn[];
  submissions?: SubmissionIn[];
}) {
  // local state copies so UI updates without page refresh
  const [localAssignments, setLocalAssignments] = useState<AssignmentIn[]>(assignments ?? []);
  const [localSubmissions, setLocalSubmissions] = useState<SubmissionIn[]>(submissions ?? []);

  // filters
  const [filter, setFilter] = useState<"all" | "created" | "submitted">("all");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentIn | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // keep local state synced if server props change (hot reload, SSR refresh)
  useEffect(() => setLocalAssignments(assignments ?? []), [assignments]);
  useEffect(() => setLocalSubmissions(submissions ?? []), [submissions]);

  // Listen for created assignment events (CreateAssignmentForm dispatches this event after successful creation)
  useEffect(() => {
    function handler(e: any) {
      const created = e.detail;
      if (!created) return;
      // created may contain minimal info (id, title, due_date,...). Ensure shape.
      const item: AssignmentIn = {
        id: created.id,
        title: created.title ?? "New assignment",
        description: created.description ?? null,
        file_url: created.file_url ?? null,
        due_date: created.due_date ?? null,
        created_at: created.created_at ?? new Date().toISOString(),
        submissions: created.submissions ?? [],
      };
      setLocalAssignments((prev) => [item, ...prev]);
    }
    window.addEventListener("assignmentCreated", handler as EventListener);
    return () => window.removeEventListener("assignmentCreated", handler as EventListener);
  }, []);

  // helper: in date range (if no filters -> true)
  const inDateRange = (dateStr?: string | null) => {
    if (!dateStr) return true;
    const d = new Date(dateStr);
    if (dateRange.from) {
      const from = new Date(dateRange.from);
      if (d < from) return false;
    }
    if (dateRange.to) {
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999);
      if (d > to) return false;
    }
    return true;
  };

  // derived lists
  const createdList = useMemo(
    () => localAssignments.filter((a) => inDateRange(a.created_at)),
    [localAssignments, dateRange]
  );

  // submissions list already passed from server, but we keep localSubmissions
  const submittedList = useMemo(
    () => localSubmissions.filter((s) => inDateRange(s.submitted_at)),
    [localSubmissions, dateRange]
  );

  // Delete handler
  async function handleDelete(assignmentId: string) {
    if (!confirm("Delete this assignment? This will remove it from all students.")) return;
    setDeletingId(assignmentId);
    try {
      const res = await fetch(`/api/teacher/assignments/${assignmentId}`, { method: "DELETE" });
      if (!res.ok) {
        let msg = `Failed to delete assignment (status ${res.status})`;
        try {
          const j = await res.json();
          msg = j?.error ?? j?.details ?? msg;
        } catch (_) {}
        throw new Error(msg);
      }
      // remove locally
      setLocalAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      setLocalSubmissions((prev) => prev.filter((s) => s.assignment?.id !== assignmentId));
      if (selectedAssignment?.id === assignmentId) setSelectedAssignment(null);
      alert("Assignment deleted");
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err?.message ?? "Failed to delete assignment");
    } finally {
      setDeletingId(null);
    }
  }

  // View modal: submissions for selected
  const submissionsForSelected = useMemo(() => {
    if (!selectedAssignment) return [];
    return localSubmissions.filter((s) => s.assignment?.id === selectedAssignment.id);
  }, [localSubmissions, selectedAssignment]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Filter</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="created">Created Assignments</option>
            <option value="submitted">Submitted Assignments</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">From</label>
          <input
            type="date"
            value={dateRange.from ?? ""}
            onChange={(e) => setDateRange((p) => ({ ...p, from: e.target.value }))}
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">To</label>
          <input
            type="date"
            value={dateRange.to ?? ""}
            onChange={(e) => setDateRange((p) => ({ ...p, to: e.target.value }))}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex items-center">
          <button
            onClick={() => {
              setFilter("all");
              setDateRange({});
            }}
            className="ml-2 px-3 py-1 border rounded text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Created Assignments (when filter all or created) */}
      {(filter === "all" || filter === "created") && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
          {createdList.length === 0 ? (
            <div className="text-sm text-gray-600">No assignments found.</div>
          ) : (
            <div className="grid gap-4">
              {createdList.map((a) => {
                const submittedCount = localSubmissions.filter((s) => s.assignment?.id === a.id).length;
                return (
                  <div
                    key={a.id}
                    className="p-4 border rounded shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold">{a.title}</div>
                      {a.description && <div className="text-gray-600">{a.description}</div>}
                      {a.due_date && (
                        <div className="text-sm text-gray-500">
                          Due: {new Date(a.due_date).toLocaleString()}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        {submittedCount} submitted / {a.submissions?.length ?? "-"} assigned
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/teacher-dashboard/assignments/${a.id}/edit`}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(a.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        disabled={deletingId === a.id}
                      >
                        {deletingId === a.id ? "Deleting..." : "Delete"}
                      </button>

                      <button
                        onClick={() => setSelectedAssignment(a)}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded"
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Submitted assignments (when filter all or submitted) */}
      {(filter === "all" || filter === "submitted") && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Submitted Assignments</h2>

          {submittedList.length === 0 ? (
            <div className="text-sm text-gray-600">No submissions found.</div>
          ) : (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Assignment</th>
                    <th className="px-4 py-2 text-left">Student</th>
                    <th className="px-4 py-2 text-left">Submitted At</th>
                    <th className="px-4 py-2 text-left">Grade</th>
                    <th className="px-4 py-2 text-left">Feedback</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedList.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{s.assignment?.title ?? "-"}</td>
                      <td className="px-4 py-3">{s.student?.user?.full_name ?? "-"}</td>
                      <td className="px-4 py-3">
                        {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-3">{s.grade ?? "-"}</td>
                      <td className="px-4 py-3">{s.feedback ?? "-"}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/teacher-dashboard/assignments/submitted/${s.id}`}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Grade
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* View modal - shows assignment info & submissions for that assignment */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedAssignment(null)}
            aria-hidden
          />

          <div className="relative bg-white w-full max-w-3xl rounded shadow-lg p-6 z-10 overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedAssignment.title}</h3>
                <p className="text-sm text-gray-500">Created: {new Date(selectedAssignment.created_at).toLocaleString()}</p>
                {selectedAssignment.due_date && (
                  <p className="text-sm text-gray-500">Due: {new Date(selectedAssignment.due_date).toLocaleString()}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/teacher-dashboard/assignments/${selectedAssignment.id}/edit`} className="px-3 py-1 bg-blue-600 text-white rounded">
                  Edit
                </Link>
                <button onClick={() => setSelectedAssignment(null)} className="px-3 py-1 border rounded">Close</button>
              </div>
            </div>

            {selectedAssignment.description && <div className="mb-4 text-gray-700">{selectedAssignment.description}</div>}
            {selectedAssignment.file_url && (
              <div className="mb-4">
                <a href={selectedAssignment.file_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open assignment file</a>
              </div>
            )}

            <hr className="my-4" />
            <h4 className="font-semibold mb-2">Submissions</h4>

            {submissionsForSelected.length === 0 ? (
              <div className="text-sm text-gray-600">No students have submitted yet.</div>
            ) : (
              <div className="space-y-3">
                {submissionsForSelected.map((sub) => (
                  <div key={sub.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{sub.student?.user?.full_name ?? "Student"}</div>
                        <div className="text-sm text-gray-500">Submitted: {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : "—"}</div>
                        {sub.submitted_file_url && (
                          <div>
                            <a href={sub.submitted_file_url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">View submitted file</a>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Grade: {sub.grade ?? "-"}</div>
                        <div className="text-sm">Feedback: {sub.feedback ?? "-"}</div>
                        <div className="mt-2">
                          <Link href={`/teacher-dashboard/assignments/submitted/${sub.id}`} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Open for grading</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
