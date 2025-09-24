
// // app/student-dashboard/assignments/components/StudentAssignmentsList.tsx
// "use client";

// import { useState } from "react";
// import AssignmentSubmitForm from "./AssignmentSubmitForm";

// type Assignment = {
//   id: string;
//   title: string;
//   description?: string;
//   file_url?: string;
//   due_date?: string;
//   submitted: boolean;
//   submission_id?: string;
//   submitted_file_url?: string;
//   grade?: string | null;
//   feedback?: string | null;
// };

// export default function StudentAssignmentsList({
//   assignments,
//   studentId,
// }: {
//   assignments: Assignment[];
//   studentId: string;
// }) {
//   const [assignList, setAssignList] = useState(assignments);
//   const [activeFormId, setActiveFormId] = useState<string | null>(null);

//   const handleSuccess = (assignmentId: string, submissionId: string) => {
//     setAssignList((prev) =>
//       prev.map((a) =>
//         a.id === assignmentId
//           ? { ...a, submitted: true, submission_id: submissionId }
//           : a
//       )
//     );
//     setActiveFormId(null);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Assignments</h2>
//       {assignList.length === 0 && <div>No assignments available yet.</div>}
//       {assignList.map((a) => (
//         <div key={a.id} className="bg-white shadow rounded p-4 space-y-2">
//           <div className="flex justify-between items-start">
//             <div>
//               <div className="font-semibold text-lg">{a.title}</div>
//               {a.description && (
//                 <div className="text-gray-600">{a.description}</div>
//               )}
//               {a.due_date && (
//                 <div className="text-sm text-gray-500">
//                   Due: {new Date(a.due_date).toLocaleString()}
//                 </div>
//               )}
//               {a.submitted && (
//                 <div className="text-sm text-green-600 font-medium mt-1">
//                   Submitted{a.grade && ` - Grade: ${a.grade}`}
//                 </div>
//               )}
//             </div>

//             {!a.submitted && (
//               <button
//                 className="px-3 py-1 bg-blue-600 text-white rounded"
//                 onClick={() => setActiveFormId(a.id)}
//               >
//                 Submit
//               </button>
//             )}
//           </div>

//           {activeFormId === a.id && !a.submitted && (
//             <AssignmentSubmitForm
//               assignmentId={a.id}
//               studentId={studentId}
//               onSuccess={(submissionId: string) =>
//                 handleSuccess(a.id, submissionId)
//               }
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }




// app/student-dashboard/assignments/components/StudentAssignmentsList.tsx
"use client";

import { useState, useMemo } from "react";
import AssignmentSubmitForm from "./AssignmentSubmitForm";

type Assignment = {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  due_date?: string;
  submitted: boolean;
  submission_id?: string;
  submitted_file_url?: string;
  grade?: string | null;
  feedback?: string | null;
  created_at?: string; // for "new assignment"
};

type Filter = "all" | "unsubmitted" | "submitted" | "new";

export default function StudentAssignmentsList({
  assignments,
  studentId,
}: {
  assignments: Assignment[];
  studentId: string;
}) {
  const [assignList, setAssignList] = useState(assignments);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const handleSuccess = (assignmentId: string, submissionId: string) => {
    setAssignList((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, submitted: true, submission_id: submissionId }
          : a
      )
    );
    setActiveFormId(null);
  };

  // Filter + Sort assignments
  const filteredAssignments = useMemo(() => {
    let list = [...assignList];

    if (filter === "unsubmitted") {
      list = list.filter((a) => !a.submitted);
    } else if (filter === "submitted") {
      list = list.filter((a) => a.submitted);
    } else if (filter === "new") {
      // Example: new assignments created in last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      list = list.filter((a) => a.created_at && new Date(a.created_at) >= oneWeekAgo);
    }

    // Always show unsubmitted first, then submitted
    list.sort((a, b) => {
      if (a.submitted === b.submitted) return 0;
      return a.submitted ? 1 : -1;
    });

    return list;
  }, [assignList, filter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>

        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="unsubmitted">Unsubmitted</option>
          <option value="submitted">Submitted</option>
          <option value="new">New</option>
        </select>
      </div>

      {filteredAssignments.length === 0 && <div>No assignments available.</div>}

      {filteredAssignments.map((a) => (
        <div key={a.id} className="bg-white shadow rounded p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg">{a.title}</div>
              {a.description && (
                <div className="text-gray-600">{a.description}</div>
              )}
              {a.due_date && (
                <div className="text-sm text-gray-500">
                  Due: {new Date(a.due_date).toLocaleString()}
                </div>
              )}
              {a.submitted && (
                <div className="text-sm text-green-600 font-medium mt-1">
                  ✅ Submitted {a.grade && ` - Grade: ${a.grade}`}
                </div>
              )}
              {!a.submitted && (
                <div className="text-sm text-red-600 font-medium mt-1">
                  ⏳ Not Submitted
                </div>
              )}
            </div>

            {!a.submitted && (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => setActiveFormId(a.id)}
              >
                Submit
              </button>
            )}
          </div>

          {activeFormId === a.id && !a.submitted && (
            <AssignmentSubmitForm
              assignmentId={a.id}
              studentId={studentId}
              onSuccess={(submissionId: string) =>
                handleSuccess(a.id, submissionId)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
