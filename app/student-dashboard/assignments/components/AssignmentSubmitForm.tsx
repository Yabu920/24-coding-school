// // app/student-dashboard/assignments/components/AssignmentSubmitForm.tsx
// "use client";

// import { useState, useEffect } from "react";


// type Props = {
//   assignmentId: string;
//   studentId: string;
//   onSuccess: (submissionId: string) => void;
// };

// type Teacher = {
//   id: string;
//   full_name: string;
// };

// export default function AssignmentSubmitForm({ assignmentId, studentId, onSuccess }: Props) {
//   const [file, setFile] = useState<File | null>(null);
//   const [description, setDescription] = useState("");
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Fetch teachers for this assignment's course
//   useEffect(() => {
//     async function fetchTeachers() {
//       try {
//         const res = await fetch(`/api/student/assignments/${assignmentId}/teachers`);
//         if (!res.ok) throw new Error("Failed to fetch teachers");
//         const data = await res.json();
//         setTeachers(data.teachers);
//         if (data.teachers.length > 0) setSelectedTeacher(data.teachers[0].id);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     fetchTeachers();
//   }, [assignmentId]);

//   const submitAssignment = async () => {
//     if (!file) {
//       alert("Please select a file");
//       return;
//     }
//     if (!selectedTeacher) {
//       alert("Please select a teacher");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("assignmentId", assignmentId);
//     formData.append("studentId", studentId);
//     formData.append("teacherId", selectedTeacher);
//     formData.append("description", description);
//     formData.append("file", file);

//     setLoading(true);
//     try {
//       const res = await fetch("/api/student/assignments/submit", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to submit assignment");

//       onSuccess(data.submissionId);
//       alert("Assignment submitted successfully!");
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-4 p-4 border rounded space-y-3 bg-gray-50">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
//         <textarea
//           className="mt-1 w-full border rounded px-3 py-2"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Write any notes or explanation..."
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
//         <select
//           className="mt-1 w-full border rounded px-3 py-2"
//           value={selectedTeacher}
//           onChange={(e) => setSelectedTeacher(e.target.value)}
//         >
//           {teachers.map((t) => (
//             <option key={t.id} value={t.id}>
//               {t.full_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Upload File</label>
//         <input
//           type="file"
//           className="mt-1"
//           onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//         />
//       </div>

//       <div>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//           onClick={submitAssignment}
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit Assignment"}
//         </button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";

// type Props = {
//   assignmentId: string;
//   studentId: string;
//   onSuccess: (submission: Submission) => void;
// };

// type Teacher = {
//   id: string;
//   full_name: string;
// };

// type Submission = {
//   id: string;
//   student_id: string;
//   submitted_file_url?: string;
//   grade?: string | null;
//   feedback?: string | null;
//   submitted_at?: string | null;
// };

// export default function AssignmentSubmitForm({ assignmentId, studentId, onSuccess }: Props) {
//   const [file, setFile] = useState<File | null>(null);
//   const [description, setDescription] = useState("");
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [selectedTeacher, setSelectedTeacher] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Fetch teachers for this assignment's course
//   useEffect(() => {
//     async function fetchTeachers() {
//       try {
//         const res = await fetch(`/api/student/assignments/${assignmentId}/teachers`);
//         if (!res.ok) throw new Error("Failed to fetch teachers");
//         const data = await res.json();
//         setTeachers(data.teachers);
//         if (data.teachers.length > 0) setSelectedTeacher(data.teachers[0].id);
//       } catch (err) {
//         console.error(err);
//       }
//     }
//     fetchTeachers();
//   }, [assignmentId]);

//   const submitAssignment = async () => {
//     if (!file) {
//       alert("Please select a file");
//       return;
//     }
//     if (!selectedTeacher) {
//       alert("Please select a teacher");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("assignmentId", assignmentId);
//     formData.append("studentId", studentId);
//     formData.append("teacherId", selectedTeacher);
//     formData.append("description", description);
//     formData.append("file", file);

//     setLoading(true);
//     try {
//       const res = await fetch("/api/student/assignments/submit", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to submit assignment");

//       // Prepare submission object for the parent component
//       const submission: Submission = {
//         id: data.submission.id,
//         student_id: studentId,
//         submitted_file_url: data.submission.submitted_file_url,
//         grade: data.submission.grade,
//         feedback: data.submission.feedback,
//         submitted_at: data.submission.submitted_at,
//       };

//       onSuccess(submission);
//       alert("Assignment submitted successfully!");
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-4 p-4 border rounded space-y-3 bg-gray-50">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
//         <textarea
//           className="mt-1 w-full border rounded px-3 py-2"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Write any notes or explanation..."
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
//         <select
//           className="mt-1 w-full border rounded px-3 py-2"
//           value={selectedTeacher}
//           onChange={(e) => setSelectedTeacher(e.target.value)}
//         >
//           {teachers.map((t) => (
//             <option key={t.id} value={t.id}>
//               {t.full_name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">Upload File</label>
//         <input
//           type="file"
//           className="mt-1"
//           onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//         />
//       </div>

//       <div>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//           onClick={submitAssignment}
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit Assignment"}
//         </button>
//       </div>
//     </div>
//   );
// }


// app/student-dashboard/assignments/components/AssignmentSubmitForm.tsx
"use client";

import { useState, useEffect } from "react";

type Props = {
  assignmentId: string;
  studentId: string;
  onSuccess: (submissionId: string) => void;
};

type Teacher = {
  id: string;
  full_name: string;
};

export default function AssignmentSubmitForm({ assignmentId, studentId, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch(`/api/student/assignments/${assignmentId}/teachers`);
        if (!res.ok) throw new Error("Failed to fetch teachers");
        const data = await res.json();
        setTeachers(data.teachers);
        if (data.teachers.length > 0) setSelectedTeacher(data.teachers[0].id);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTeachers();
  }, [assignmentId]);

  const submitAssignment = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    if (!selectedTeacher) {
      alert("Please select a teacher");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId);
    formData.append("teacherId", selectedTeacher);
    formData.append("description", description);
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/student/assignments/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit assignment");

      const submissionId = data?.submission?.id;
      if (!submissionId) throw new Error("Submission ID not returned");
      onSuccess(submissionId);
      alert("Assignment submitted successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded space-y-3 bg-gray-50">
      <div>
        <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          className="mt-1 w-full border rounded px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write any notes or explanation..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
        <select
          className="mt-1 w-full border rounded px-3 py-2"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload File</label>
        <input
          type="file"
          className="mt-1"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={submitAssignment}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Assignment"}
        </button>
      </div>
    </div>
  );
}
