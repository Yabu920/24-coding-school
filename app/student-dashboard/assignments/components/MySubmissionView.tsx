// app/student-dashboard/assignments/components/MySubmissionView.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  assignmentId: string;
};

export default function MySubmissionView({ assignmentId }: Props) {
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const res = await fetch(`/api/student/assignments/${assignmentId}/my-submission`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load submission");
        setSubmission(data.submission);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmission();
  }, [assignmentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!submission) return <p>No submission yet.</p>;

  return (
    <div className="border rounded p-4 bg-white shadow space-y-3">
      <h2 className="text-lg font-semibold">My Submission</h2>

      <div>
        <p className="text-sm text-gray-700">
          <strong>Description:</strong> {submission.description || "—"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>File:</strong>{" "}
          <a
            href={submission.submitted_file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View File
          </a>
        </p>
        <p className="text-sm text-gray-500">
          Submitted at: {new Date(submission.submitted_at).toLocaleString()}
        </p>
      </div>

      <div className="mt-4 border-t pt-2">
        <h3 className="text-md font-semibold">Assigned Teacher</h3>
        {submission.assignment?.teacher ? (
          <p className="text-sm text-gray-700">
            {submission.assignment.teacher.user?.full_name || "Unnamed Teacher"}
          </p>
        ) : (
          <p className="text-sm text-gray-500">No teacher assigned</p>
        )}
      </div>
    </div>
  );
}
