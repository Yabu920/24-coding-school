// import { prisma } from "@/lib/prisma";

// export default async function AssignmentDetail({ params }: { params: { id: string } }) {
//   const assignment = await prisma.assignments.findUnique({
//     where: { id: params.id },
//     include: { teacher: true, course: true },
//   });

//   if (!assignment) {
//     return <p>Assignment not found</p>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">{assignment.title}</h1>
//       <p className="text-gray-700">{assignment.description}</p>
//       {assignment.file_url && (
//         <a
//           href={assignment.file_url}
//           target="_blank"
//           className="text-blue-600 underline mt-2 block"
//         >
//           Download File
//         </a>
//       )}
//       <p className="mt-4 text-sm text-gray-500">
//         Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}
//       </p>
//     </div>
//   );
// }



// /student-dashboard/assignments/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Assignment = {
  id: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  due_date?: string | null;
  teacher_id: string;
  course_id?: string | null;
  teacher: { id: string; user: { full_name: string } };
};

type Submission = {
  id: string;
  description?: string | null;
  submitted_file_url?: string | null;
  teacher_id: string;
  grade?: string | null;
  feedback?: string | null;
};

type Teacher = { id: string; user: { full_name: string } };

export default function AssignmentDetailPage({
  assignment,
  submission,
  teachers,
}: {
  assignment: Assignment;
  submission: Submission;
  teachers: Teacher[];
}) {
  const router = useRouter();
  const [description, setDescription] = useState(submission.description ?? "");
  const [selectedTeacher, setSelectedTeacher] = useState(submission.teacher_id);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;

  const editable =
    (!submission.grade && !submission.feedback) && (!dueDate || now < dueDate);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("teacher_id", selectedTeacher);
    if (file) formData.append("file", file);

    setSaving(true);
    try {
      const res = await fetch(`/api/student/assignments/${submission.id}/update`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to save");
      router.refresh();
      alert("Submission updated successfully");
    } catch (err: any) {
      alert(err.message || "Error updating submission");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Assignment Info */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>
        {assignment.file_url && (
          <a
            href={assignment.file_url}
            target="_blank"
            className="text-blue-600 underline block"
          >
            Download Assignment File
          </a>
        )}
        <p className="text-sm text-gray-500">
          Due: {dueDate ? dueDate.toLocaleString() : "No due date"}
        </p>
      </div>

      {/* Student Submission */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Your Submission</h2>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!editable}
            className="mt-1 w-full border rounded px-2 py-1 resize-none"
            rows={4}
          />
        </div>

        {/* Teacher Selection */}
        <div>
          <label className="block text-sm font-medium">Assigned Teacher</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            disabled={!editable}
            className="mt-1 w-full border rounded px-2 py-1"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.user.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium">Submission File</label>
          {submission.submitted_file_url && !file && (
            <a
              href={submission.submitted_file_url}
              target="_blank"
              className="text-blue-600 underline block"
            >
              View Current File
            </a>
          )}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={!editable}
            className="mt-1"
          />
        </div>

        {/* Grade & Feedback */}
        <div>
          <p className="text-sm font-medium">Grade: {submission.grade ?? "-"}</p>
          <p className="text-sm font-medium">Feedback: {submission.feedback ?? "-"}</p>
        </div>

        {editable && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save Submission"}
          </button>
        )}

        {!editable && (
          <p className="text-sm text-red-600">
            Submission is locked. You cannot edit after due date or after grading.
          </p>
        )}
      </div>
    </div>
  );
}

