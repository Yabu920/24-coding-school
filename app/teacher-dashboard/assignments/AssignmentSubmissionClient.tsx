//app/teacher-dashboard/assignments/AssignmentSubmissionsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AssignmentProp = {
  id: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  due_date?: string | null;
  course?: { id: string; name: string } | undefined;
  teacher?: { id: string; user: { full_name: string } } | undefined;
  submissions: {
    id: string;
    student: { id: string; user: { id: string; full_name: string; email: string } };
    submitted_file_url?: string | null;
    description?: string | null;
    grade?: string | null;
    feedback?: string | null;
    submitted_at?: string | null;
  }[];
};

export default function AssignmentSubmissionsClient({ assignment }: { assignment: AssignmentProp }) {
  const router = useRouter();

  // Create local state to track per-submission grade/feedback and saving states
  const [rows, setRows] = useState(
    assignment.submissions.map((s) => ({
      id: s.id,
      grade: s.grade ?? "",
      feedback: s.feedback ?? "",
      saving: false,
      message: "" as string,
    }))
  );
     

     const save = async (submissionId: string) => {
  setRows((prev) =>
    prev.map((r) =>
      r.id === submissionId ? { ...r, saving: true, message: "" } : r
    )
  );

  const row = rows.find((r) => r.id === submissionId);
  if (!row) {
    setRows((prev) =>
      prev.map((r) =>
        r.id === submissionId
          ? { ...r, saving: false, message: "Row not found" }
          : r
      )
    );
    return;
  }

  try {
    const res = await fetch(
      `/api/teacher/assignments/submitted/${submissionId}/grade`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: row.grade === "" ? null : row.grade,
          feedback: row.feedback === "" ? null : row.feedback,
        }),
        cache: "no-store",
      }
    );

    const raw = await res.text(); // ✅ read once only
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(raw); // not JSON, likely HTML error page
    }

    if (!res.ok) {
      const serverMsg =
        parsed?.error || parsed?.message || JSON.stringify(parsed);
      throw new Error(serverMsg || "Failed to save");
    }

    const updatedSubmission = parsed.submission ?? parsed;

    setRows((prev) =>
      prev.map((r) =>
        r.id === submissionId
          ? {
              ...r,
              saving: false,
              message: "Saved",
              grade: updatedSubmission?.grade ?? r.grade,
              feedback: updatedSubmission?.feedback ?? r.feedback,
            }
          : r
      )
    );
  } catch (err: any) {
    const message = err?.message || "Save failed";
    setRows((prev) =>
      prev.map((r) =>
        r.id === submissionId ? { ...r, saving: false, message } : r
      )
    );
    console.error("Save error:", message);
  }
};

  const updateField = (submissionId: string, field: "grade" | "feedback", value: string) => {
    setRows((prev) => prev.map((r) => (r.id === submissionId ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="space-y-6">
      {/* assignment header */}
      <div className="bg-white p-4 rounded shadow">
        <div className="text-gray-700">{assignment.description}</div>
        <div className="text-sm text-gray-500 mt-2">
          Course: {assignment.course?.name ?? "-"} • Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleString() : "N/A"}
        </div>
      </div>

      {/* submissions */}
      <div className="space-y-4">
        {assignment.submissions.length === 0 ? (
          <div className="text-gray-600">No submissions yet.</div>
        ) : (
          assignment.submissions.map((s) => {
            const state = rows.find((r) => r.id === s.id)!;
            return (
              <div key={s.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{s.student.user.full_name}</div>
                    <div className="text-sm text-gray-500">{s.student.user.email}</div>
                    <div className="text-sm mt-1">{s.description ?? "-"}</div>
                    <div className="text-sm text-gray-500 mt-1">Submitted: {s.submitted_at ? new Date(s.submitted_at).toLocaleString() : "-"}</div>
                    {s.submitted_file_url && (
                      <div className="mt-2">
                        <a href={s.submitted_file_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View / Download file</a>
                      </div>
                    )}
                  </div>

                  <div className="w-72">
                    <label className="block text-sm font-medium">Grade</label>
                    <input type="text" className="mt-1 w-full border rounded px-2 py-1" value={state.grade} onChange={(e) => updateField(s.id, "grade", e.target.value)} />

                    <label className="block text-sm font-medium mt-2">Feedback</label>
                    <input type="text" className="mt-1 w-full border rounded px-2 py-1" value={state.feedback} onChange={(e) => updateField(s.id, "feedback", e.target.value)} />

                    <div className="flex items-center gap-2 mt-3">
                      <button disabled={state.saving} onClick={() => save(s.id)} className="px-3 py-1 bg-green-600 text-white rounded">
                        {state.saving ? "Saving..." : "Save"}
                      </button>

                      <button onClick={() => router.refresh()} className="px-3 py-1 bg-gray-100 rounded">Refresh</button>
                    </div>

                    {state.message && <div className={`mt-2 text-sm ${state.message === "Saved" ? "text-green-600" : "text-red-600"}`}>{state.message}</div>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
