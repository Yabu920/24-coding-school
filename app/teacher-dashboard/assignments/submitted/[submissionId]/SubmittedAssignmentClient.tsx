// "use client";

// import { useState } from "react";

// type Submission = {
//   id: string;
//   submitted_file_url?: string | null;
//   grade?: string | null;
//   feedback?: string | null;
//   student: { user: { full_name: string } };
//   assignment: { title: string; description?: string | null };
// };

// export default function SubmittedAssignmentClient({ submission }: { submission: Submission }) {
//   const [grade, setGrade] = useState(submission.grade ?? "");
//   const [feedback, setFeedback] = useState(submission.feedback ?? "");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleSave = async () => {
//     setLoading(true);
//     setSuccess(false);
//     try {
//       const res = await fetch(`/api/teacher/assignments/submitted/${submission.id}/grade`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ grade, feedback }),
//       });

//       if (!res.ok) throw new Error("Failed to save");

//       setSuccess(true);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save grade/feedback");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded p-6 space-y-4 max-w-lg">
//       <div>
//         <div className="font-semibold">Student:</div>
//         <div>{submission.student.user.full_name}</div>
//       </div>

//       <div>
//         <div className="font-semibold">Assignment:</div>
//         <div>{submission.assignment.title}</div>
//         {submission.assignment.description && <div className="text-gray-600">{submission.assignment.description}</div>}
//       </div>

//       {submission.submitted_file_url && (
//         <div>
//           <a
//             href={submission.submitted_file_url}
//             target="_blank"
//             className="text-blue-600 underline"
//           >
//             View Submitted File
//           </a>
//         </div>
//       )}

//       <div className="space-y-2">
//         <div>
//           <label className="block font-medium">Grade</label>
//           <input
//             type="text"
//             className="border rounded w-full p-2"
//             value={grade}
//             onChange={(e) => setGrade(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Feedback</label>
//           <textarea
//             className="border rounded w-full p-2"
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//           />
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>

//         {success && <div className="text-green-600">Saved successfully!</div>}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

type SubmissionProp = {
  id: string;
  submitted_file_url?: string | null;
  grade?: string | null;
  feedback?: string | null;
  submitted_at?: string | null;
  student: {
    user: {
      full_name: string;
      email: string;
    };
  };
  assignment: {
    id: string;
    title: string;
    description?: string | null;
    course?: { name: string | null } | undefined;
    teacher?: { user: { full_name: string } } | undefined;
  };
};

export default function SubmittedAssignmentClient({
  submission,
}: {
  submission: SubmissionProp;
}) {
  const [grade, setGrade] = useState(submission.grade ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `/api/teacher/assignments/submitted/${submission.id}/grade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ grade, feedback }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to save grade/feedback");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Submitted Assignment</h2>

      <div className="space-y-3 text-gray-700">
        <div>
          <strong>Assignment:</strong> {submission.assignment.title}
        </div>
        {submission.assignment.description && (
          <div>
            <strong>Description:</strong> {submission.assignment.description}
          </div>
        )}
        {submission.assignment.course && (
          <div>
            <strong>Course:</strong> {submission.assignment.course.name}
          </div>
        )}
        {submission.assignment.teacher && (
          <div>
            <strong>Teacher:</strong>{" "}
            {submission.assignment.teacher.user.full_name}
          </div>
        )}
        <div>
          <strong>Student:</strong> {submission.student.user.full_name} (
          {submission.student.user.email})
        </div>
        {submission.submitted_at && (
          <div>
            <strong>Submitted At:</strong>{" "}
            {new Date(submission.submitted_at).toLocaleString()}
          </div>
        )}
        {submission.submitted_file_url && (
          <div>
            <strong>File:</strong>{" "}
            <a
              href={submission.submitted_file_url}
              target="_blank"
              className="text-blue-600 underline"
              rel="noopener noreferrer"
            >
              View File
            </a>
          </div>
        )}
      </div>

      {/* Grade & Feedback Section */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Grade</label>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Grade & Feedback"}
        </button>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">Saved successfully!</div>
        )}
      </div>
    </div>
  );
}
