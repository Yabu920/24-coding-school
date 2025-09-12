"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditAssignmentClient({ assignment }: any) {
  const router = useRouter();
  const [title, setTitle] = useState(assignment.title ?? "");
  const [description, setDescription] = useState(assignment.description ?? "");
  const [dueDate, setDueDate] = useState(assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0,16) : "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/teacher/assignments/${assignment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, dueDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update assignment");
      setMsg("Updated successfully");
      router.refresh();
    } catch (err: any) {
      setMsg(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="max-w-2xl bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Edit Assignment</h2>
      <div>
        <label className="block font-medium">Title</label>
        <input className="w-full border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea className="w-full border p-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block font-medium">Due date</label>
        <input type="datetime-local" className="w-full border p-2 rounded" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div className="flex gap-3">
        <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
      </div>
      {msg && <div className="text-sm mt-2">{msg}</div>}
    </form>
  );
}
