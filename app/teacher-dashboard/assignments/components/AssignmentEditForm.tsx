
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  due_date?: string | null;
  course_id?: string | null;
};

type Props = {
  assignment: Assignment;
};

export default function AssignmentEditForm({ assignment }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description ?? "");
  const [dueDate, setDueDate] = useState(assignment.due_date ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!title.trim()) {
      setMessage("Title is required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (dueDate) formData.append("due_date", dueDate);
      if (file) formData.append("file", file);

      const res = await fetch(`/api/teacher/assignments/${assignment.id}`, {
        method: "PUT",
        body: formData,
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (!res.ok) {
        throw new Error(json?.error || "Failed to update assignment");
      }

      setMessage("Assignment updated successfully!");
      // optional: redirect to list after save
      // router.push("/teacher-dashboard/assignments");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Failed to update assignment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold">Edit Assignment</h2>

      <label className="block text-sm font-medium">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1 w-full border rounded px-2 py-1"
      />

      <label className="block text-sm font-medium mt-2">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-1 w-full border rounded px-2 py-1"
      />

      <label className="block text-sm font-medium mt-2">Due Date</label>
      <input
        type="datetime-local"
        value={dueDate ? new Date(dueDate).toISOString().slice(0, 16) : ""}
        onChange={(e) => setDueDate(e.target.value)}
        className="mt-1 w-full border rounded px-2 py-1"
      />

      <label className="block text-sm font-medium mt-2">File</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mt-1 w-full border rounded px-2 py-1"
      />
      {assignment.file_url && (
        <div className="mt-1">
          <a
            href={assignment.file_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Current File
          </a>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
      </div>

      {message && (
        <div
          className={`mt-2 text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
