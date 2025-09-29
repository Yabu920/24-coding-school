
// // app/student-dashboard/assignments/components/StudentAssignmentsList.tsx
// "use client";

// import { useState, useMemo } from "react";
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
//   created_at?: string; // for "new assignment"
// };

// type Filter = "all" | "unsubmitted" | "submitted" | "new";

// export default function StudentAssignmentsList({
//   assignments,
//   studentId,
// }: {
//   assignments: Assignment[];
//   studentId: string;
// }) {
//   const [assignList, setAssignList] = useState(assignments);
//   const [activeFormId, setActiveFormId] = useState<string | null>(null);
//   const [filter, setFilter] = useState<Filter>("all");

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

//   // Filter + Sort assignments
//   const filteredAssignments = useMemo(() => {
//     let list = [...assignList];

//     if (filter === "unsubmitted") {
//       list = list.filter((a) => !a.submitted);
//     } else if (filter === "submitted") {
//       list = list.filter((a) => a.submitted);
//     } else if (filter === "new") {
//       // Example: new assignments created in last 7 days
//       const oneWeekAgo = new Date();
//       oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//       list = list.filter((a) => a.created_at && new Date(a.created_at) >= oneWeekAgo);
//     }

//     // Always show unsubmitted first, then submitted
//     list.sort((a, b) => {
//       if (a.submitted === b.submitted) return 0;
//       return a.submitted ? 1 : -1;
//     });

//     return list;
//   }, [assignList, filter]);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Assignments</h2>

//         {/* Filter Dropdown */}
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as Filter)}
//           className="border px-2 py-1 rounded"
//         >
//           <option value="all">All</option>
//           <option value="unsubmitted">Unsubmitted</option>
//           <option value="submitted">Submitted</option>
//           <option value="new">New</option>
//         </select>
//       </div>

//       {filteredAssignments.length === 0 && <div>No assignments available.</div>}

//       {filteredAssignments.map((a) => (
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
//                   ✅ Submitted {a.grade && ` - Grade: ${a.grade}`}
//                 </div>
//               )}
//               {!a.submitted && (
//                 <div className="text-sm text-red-600 font-medium mt-1">
//                   ⏳ Not Submitted
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
// "use client";

// import { useState, useMemo } from "react";
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
//   submitted_description?: string;
//   grade?: string | null;
//   feedback?: string | null;
//   created_at?: string;
// };

// type Filter = "all" | "unsubmitted" | "submitted" | "new";

// export default function StudentAssignmentsList({
//   assignments,
//   studentId,
// }: {
//   assignments: Assignment[];
//   studentId: string;
// }) {
//   const [assignList, setAssignList] = useState(assignments);
//   const [activeFormId, setActiveFormId] = useState<string | null>(null);
//   const [filter, setFilter] = useState<Filter>("all");

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

//   const filteredAssignments = useMemo(() => {
//     let list = [...assignList];
//     if (filter === "unsubmitted") list = list.filter((a) => !a.submitted);
//     else if (filter === "submitted") list = list.filter((a) => a.submitted);
//     else if (filter === "new") {
//       const oneWeekAgo = new Date();
//       oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//       list = list.filter((a) => a.created_at && new Date(a.created_at) >= oneWeekAgo);
//     }
//     list.sort((a, b) => (a.submitted === b.submitted ? 0 : a.submitted ? 1 : -1));
//     return list;
//   }, [assignList, filter]);

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Assignments</h2>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as Filter)}
//           className="border px-2 py-1 rounded"
//         >
//           <option value="all">All</option>
//           <option value="unsubmitted">Unsubmitted</option>
//           <option value="submitted">Submitted</option>
//           <option value="new">New</option>
//         </select>
//       </div>

//       {filteredAssignments.length === 0 && <div>No assignments available.</div>}

//       {filteredAssignments.map((a) => {
//         const dueDate = a.due_date ? new Date(a.due_date) : null;
//         const now = new Date();
//         const editable = !a.grade && !a.feedback && (!dueDate || now < dueDate);

//         return (
//           <div key={a.id} className="bg-white shadow rounded p-4 space-y-2">
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="font-semibold text-lg">{a.title}</div>
//                 {a.description && <div className="text-gray-600">{a.description}</div>}
//                 {a.due_date && (
//                   <div className="text-sm text-gray-500">
//                     Due: {new Date(a.due_date).toLocaleString()}
//                   </div>
//                 )}
//                 {a.submitted && (
//                   <div className="text-sm text-green-600 font-medium mt-1">
//                     ✅ Submitted {a.grade && ` - Grade: ${a.grade}`}
//                   </div>
//                 )}
//                 {!a.submitted && (
//                   <div className="text-sm text-red-600 font-medium mt-1">⏳ Not Submitted</div>
//                 )}
//               </div>

//               {!a.submitted && (
//                 <button
//                   className="px-3 py-1 bg-blue-600 text-white rounded"
//                   onClick={() => setActiveFormId(a.id)}
//                 >
//                   Submit
//                 </button>
//               )}

//               {a.submitted && (
//                 <button
//                   className="px-3 py-1 bg-gray-700 text-white rounded"
//                   onClick={() => setActiveFormId(a.id)}
//                 >
//                   View / Edit
//                 </button>
//               )}
//             </div>

//             {activeFormId === a.id && (
//               <AssignmentSubmitForm
//                 assignmentId={a.id}
//                 studentId={studentId}
//                 initialDescription={a.submitted_description}
//                 initialFileUrl={a.submitted_file_url}
//                 initialTeacherId={a.submission_id ? a.submission_id : ""}
//                 editable={editable}
//                 onSuccess={(submissionId: string) => handleSuccess(a.id, submissionId)}
//               />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }




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
  submitted_description?: string;
  submitted_teacher_id?: string;
  grade?: string | null;
  feedback?: string | null;
  created_at?: string;
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

  const handleSuccess = (
    assignmentId: string,
    submissionId: string,
    updatedSubmission?: Partial<Assignment>
  ) => {
    setAssignList((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              submitted: true,
              submission_id: submissionId,
              submitted_file_url:
                updatedSubmission?.submitted_file_url ?? a.submitted_file_url,
              submitted_description:
                updatedSubmission?.submitted_description ??
                a.submitted_description,
              submitted_teacher_id:
                updatedSubmission?.submitted_teacher_id ??
                a.submitted_teacher_id,
              grade: updatedSubmission?.grade ?? a.grade,
              feedback: updatedSubmission?.feedback ?? a.feedback,
            }
          : a
      )
    );
    setActiveFormId(null);
  };

  const filteredAssignments = useMemo(() => {
    let list = [...assignList];
    if (filter === "unsubmitted") list = list.filter((a) => !a.submitted);
    else if (filter === "submitted") list = list.filter((a) => a.submitted);
    else if (filter === "new") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      list = list.filter(
        (a) => a.created_at && new Date(a.created_at) >= oneWeekAgo
      );
    }
    list.sort((a, b) =>
      a.submitted === b.submitted ? 0 : a.submitted ? 1 : -1
    );
    return list;
  }, [assignList, filter]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>
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

      {filteredAssignments.length === 0 && (
        <div>No assignments available.</div>
      )}

      {filteredAssignments.map((a) => {
        const dueDate = a.due_date ? new Date(a.due_date) : null;
        const now = new Date();
        const editable = !a.grade && !a.feedback && (!dueDate || now < dueDate);

        return (
          <div key={a.id} className="bg-white shadow rounded p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg">{a.title}</div>
                {a.description && (
                  <div className="text-gray-600 whitespace-pre-wrap">
                    {a.description}
                  </div>
                )}
                {a.file_url && (
                  <a
                    href={a.file_url}
                    target="_blank"
                    className="text-blue-600 underline block mt-1"
                  >
                    📎 Assignment File
                  </a>
                )}
                {a.due_date && (
                  <div className="text-sm text-gray-500">
                    Due: {new Date(a.due_date).toLocaleString()}
                  </div>
                )}
                {a.submitted && (
                  <div className="text-sm text-green-600 font-medium mt-1">
                    ✅ Submitted{" "}
                    {a.grade && (
                      <span>
                        - Grade: {a.grade}{" "}
                        {a.feedback && ` | Feedback: ${a.feedback}`}
                      </span>
                    )}
                  </div>
                )}
                {!a.submitted && (
                  <div className="text-sm text-red-600 font-medium mt-1">
                    ⏳ Not Submitted
                  </div>
                )}
              </div>

              <button
                className={`px-3 py-1 rounded text-white ${
                  a.submitted ? "bg-gray-700" : "bg-blue-600"
                }`}
                onClick={() =>
                  setActiveFormId(activeFormId === a.id ? null : a.id)
                }
              >
                {a.submitted ? "View / Edit" : "Submit"}
              </button>
            </div>

            {activeFormId === a.id && (
              <AssignmentSubmitForm
                assignmentId={a.id}
                studentId={studentId}
                initialDescription={a.submitted_description}
                initialFileUrl={a.submitted_file_url}
                initialTeacherId={a.submitted_teacher_id}
                editable={editable}
                onSuccess={(submissionId, updatedSubmission) =>
                  handleSuccess(a.id, submissionId, updatedSubmission)
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
