"use client";
import { useState } from "react";
import type { CourseDTO } from "@/lib/types";

export default function ClassesManager({ initialCourses }: { initialCourses: CourseDTO[] }) {
  const [courses, setCourses] = useState<CourseDTO[]>(initialCourses ?? []);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  async function createCourse() {
    if (!name.trim()) return alert("Name required");
    setCreating(true);
    try {
      const res = await fetch("/api/teacher/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed");
      setCourses((s) => [body.course, ...s]);
      setName("");
      setDescription("");
    } catch (err: any) {
      alert(err.message || "Error");
    } finally {
      setCreating(false);
    }
  }

  async function removeCourse(id: string) {
    if (!confirm("Delete course?")) return;
    try {
      const res = await fetch(`/api/teacher/classes/${id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed");
      setCourses((s) => s.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Classes</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" placeholder="Class name" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" placeholder="Short description" />
        <button onClick={createCourse} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={creating}>
          {creating ? "Creating..." : "Create Class"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-500">{c.description}</div>
                <div className="mt-2 text-xs text-gray-600">Students: {c.student_count ?? 0}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="text-sm text-blue-600" onClick={() => (location.href = `/teacher-dashboard/courses/${c.id}`)}>
                  View
                </button>
                <button className="text-sm text-red-600" onClick={() => removeCourse(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && <div>No classes yet.</div>}
      </div>
    </div>
  );
}
