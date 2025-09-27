// app/teacher-dashboard/assignments/components/TeacherAssignmentsClient.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function TeacherAssignmentsClient({
  assignments = [],
  submissions = [],
}: {
  assignments?: any[];
  submissions?: any[];
}) {
  const [filter, setFilter] = useState<"all" | "created" | "submitted">("all");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const inDateRange = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    if (dateRange.from && date < new Date(dateRange.from)) return false;
    if (dateRange.to && date > new Date(dateRange.to)) return false;
    return true;
  };

  const filteredAssignments =
    filter === "all" || filter === "created"
      ? assignments.filter((a) => inDateRange(a.created_at))
      : [];

  const filteredSubmissions =
    filter === "all" || filter === "submitted"
      ? submissions.filter((s) => inDateRange(s.submitted_at))
      : [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Filter</label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "created" | "submitted")
            }
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
            onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To</label>
          <input
            type="date"
            value={dateRange.to ?? ""}
            onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {/* Assignments */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
        {filteredAssignments.length === 0 ? (
          <div className="text-sm text-gray-600">No assignments found.</div>
        ) : (
          <div className="grid gap-4">
            {filteredAssignments.map((a) => (
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
                    {a.submissions?.length ?? 0} submission(s)
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/teacher-dashboard/assignments/${a.id}/edit`}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/teacher-dashboard/assignments/${a.id}`}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submissions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Submitted Assignments</h2>
        {filteredSubmissions.length === 0 ? (
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
                {filteredSubmissions.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{s.assignment.title}</td>
                    <td className="px-4 py-3">{s.student.user.full_name}</td>
                    <td className="px-4 py-3">
                      {s.submitted_at
                        ? new Date(s.submitted_at).toLocaleString()
                        : "-"}
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
    </div>
  );
}
