"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  file_url: string | null;
};

export default function AssignmentEditClient({ assignment }: { assignment: Assignment }) {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description ?? "");
  const [dueDate, setDueDate] = useState(assignment.due_date ?? "");
  const [fileUrl, setFileUrl] = useState(assignment.file_url ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const saveAssignment = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/teacher/assignments/${assignment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          due_date: dueDate,
          file_url: fileUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setMessage("Assignment updated successfully!");
      router.push("/teacher-dashboard/assignments"); // redirect back
    } catch (err: any) {
      setMessage(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate ?? ""}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">File URL</label>
        <input
          type="text"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
          placeholder="Optional file link"
        />
      </div>

      <button
        disabled={saving}
        onClick={saveAssignment}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      {message && (
        <div className={`mt-2 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
