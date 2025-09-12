"use client";

import { useState } from "react";

export default function GradeForm({
  submissionId,
  initialGrade,
  initialFeedback,
}: {
  submissionId: string;
  initialGrade?: number | null;
  initialFeedback?: string | null;
}) {
  const [grade, setGrade] = useState(initialGrade ?? "");
  const [feedback, setFeedback] = useState(initialFeedback ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(
        `/api/teacher/assignments/submitted/${submissionId}/grade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grade, feedback }),
        }
      );

      if (!res.ok) throw new Error("Failed to save");

      setMessage("Saved!");
    } catch (err) {
      setMessage("Failed to save grade/feedback.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder="Grade"
        value={grade}
        onChange={(e) => setGrade(Number(e.target.value))}
        className="border px-2 py-1 rounded w-20"
      />
      <input
        type="text"
        placeholder="Feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="border px-2 py-1 rounded flex-1"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>
      {message && <span className="text-sm ml-2">{message}</span>}
    </div>
  );
}
