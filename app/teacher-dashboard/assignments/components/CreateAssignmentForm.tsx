// app/teacher-dashboard/assignments/components/CreateAssignmentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CourseOption = { id: string; name: string };

export default function CreateAssignmentForm({ courses }: { courses: CourseOption[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [courseId, setCourseId] = useState<string | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim()) {
      setMessage("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (dueDate) formData.append("dueDate", dueDate);
    if (courseId) formData.append("courseId", courseId);
    if (file) formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/teacher/assignments/create", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create assignment");

      // Success: clear form and refresh page data
      setTitle("");
      setDescription("");
      setDueDate("");
      setFile(null);
      setCourseId("");
      setMessage("Assignment created");
      // refresh server-side data on this page
      router.refresh();
    } catch (err: any) {
      setMessage(err.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      {courses.length > 0 && (
        <div>
          <label className="block font-medium">Course</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- Select course (optional) --</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block font-medium">Due Date (optional)</label>
        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium">File (optional)</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>

      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </div>

      {message && <div className="text-sm mt-2 text-gray-700">{message}</div>}
    </form>
  );
}
