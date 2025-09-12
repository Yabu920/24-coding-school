// "use client";
// import AssignmentSubmitForm from "./AssignmentSubmitForm";

// interface Assignment {
//   id: string;
//   title: string;
//   description: string;
//   due_date: string | null;
//   course: { name: string };
//   submissions: { submitted_at: string }[];
// }

// export default function AssignmentsList({ assignments, studentId }: { assignments: Assignment[]; studentId: string }) {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Assignments</h2>
//       <div className="grid gap-4">
//         {assignments.map(a => (
//           <div key={a.id} className="bg-white p-4 rounded shadow">
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="font-semibold">{a.title}</div>
//                 <div className="text-sm text-gray-500">{a.course?.name}</div>
//                 <div className="text-sm text-gray-600">{a.description}</div>
//               </div>
//               <div className="text-sm text-gray-600">
//                 Due: {a.due_date ? new Date(a.due_date).toLocaleDateString() : "No due date"}
//               </div>
//             </div>

//             <div className="mt-3">
//               {a.submissions.length > 0 ? (
//                 <div className="text-sm text-green-600">Submitted on {new Date(a.submissions[0].submitted_at!).toLocaleString()}</div>
//               ) : (
//                 <AssignmentSubmitForm assignmentId={a.id} />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

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
//                   Submitted
//                   {a.grade && ` - Grade: ${a.grade}`}
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

//           {activeFormId === a.id && (
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


// "use client";

// import { useState } from "react";
// import AssignmentSubmitForm from "./AssignmentSubmitForm";

// type Submission = {
//   id: string;
//   student_id: string;
//   teacher_id?: string;
//   submitted_file_url?: string;
//   grade?: string | null;
//   feedback?: string | null;
//   submitted_at?: string | null;
// };

// type Assignment = {
//   id: string;
//   title: string;
//   description?: string;
//   file_url?: string;
//   due_date?: string;
//   submissions: Submission[];
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

//   const handleSuccess = (assignmentId: string, submission: Submission) => {
//     setAssignList((prev) =>
//       prev.map((a) =>
//         a.id === assignmentId
//           ? { 
//               ...a, 
//               submissions: [...a.submissions.filter(s => s.student_id !== studentId), submission] 
//             }
//           : a
//       )
//     );
//     setActiveFormId(null);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Assignments</h2>
//       {assignList.length === 0 && <div>No assignments available yet.</div>}
//       {assignList.map((a) => {
//         const studentSubmission = a.submissions.find(s => s.student_id === studentId);
//         const isSubmitted = !!studentSubmission;

//         return (
//           <div key={a.id} className="bg-white shadow rounded p-4 space-y-2">
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="font-semibold text-lg">{a.title}</div>
//                 {a.description && (
//                   <div className="text-gray-600">{a.description}</div>
//                 )}
//                 {a.due_date && (
//                   <div className="text-sm text-gray-500">
//                     Due: {new Date(a.due_date).toLocaleString()}
//                   </div>
//                 )}
//                 {isSubmitted && (
//                   <div className="text-sm text-green-600 font-medium mt-1">
//                     Submitted
//                     {studentSubmission?.grade && ` - Grade: ${studentSubmission.grade}`}
//                   </div>
//                 )}
//               </div>

//               {!isSubmitted && (
//                 <button
//                   className="px-3 py-1 bg-blue-600 text-white rounded"
//                   onClick={() => setActiveFormId(a.id)}
//                 >
//                   Submit
//                 </button>
//               )}
//             </div>

//             {activeFormId === a.id && (
//               <AssignmentSubmitForm
//                 assignmentId={a.id}
//                 studentId={studentId}
//                 onSuccess={(submission: Submission) =>
//                   handleSuccess(a.id, submission)
//                 }
//               />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import AssignmentSubmitForm from "./AssignmentSubmitForm";

// type Submission = {
//   id: string;
//   student_id: string;
//   teacher_id?: string;
//   submitted_file_url?: string;
//   grade?: string | null;
//   feedback?: string | null;
//   submitted_at?: string;
// };

// type Assignment = {
//   id: string;
//   title: string;
//   description?: string;
//   file_url?: string;
//   due_date?: string;
//   submissions: Submission[];
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

//   const handleSuccess = (assignmentId: string, newSubmission: Submission) => {
//     setAssignList((prev) =>
//       prev.map((a) =>
//         a.id === assignmentId
//           ? { ...a, submissions: [newSubmission] }
//           : a
//       )
//     );
//     setActiveFormId(null);
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-bold">Assignments</h2>
//       {assignList.length === 0 && <div>No assignments available yet.</div>}

//       {assignList.map((a) => {
//         const isSubmitted = a.submissions.length > 0;
//         const submission = a.submissions[0];

//         return (
//           <div key={a.id} className="bg-white shadow rounded p-4 space-y-2">
//             <div className="flex justify-between items-start">
//               <div>
//                 <div className="font-semibold text-lg">{a.title}</div>
//                 {a.description && (
//                   <div className="text-gray-600">{a.description}</div>
//                 )}
//                 {a.due_date && (
//                   <div className="text-sm text-gray-500">
//                     Due: {new Date(a.due_date).toLocaleString()}
//                   </div>
//                 )}
//                 {isSubmitted && (
//                   <div className="text-sm text-green-600 font-medium mt-1">
//                     Submitted
//                     {submission?.grade && ` - Grade: ${submission.grade}`}
//                   </div>
//                 )}
//               </div>

//               {!isSubmitted && (
//                 <button
//                   className="px-3 py-1 bg-blue-600 text-white rounded"
//                   onClick={() => setActiveFormId(a.id)}
//                 >
//                   Submit
//                 </button>
//               )}
//             </div>

//             {activeFormId === a.id && (
//               <AssignmentSubmitForm
//                 assignmentId={a.id}
//                 studentId={studentId}
//                 onSuccess={(newSubmission: Submission) =>
//                   handleSuccess(a.id, newSubmission)
//                 }
//               />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// app/student-dashboard/assignments/components/StudentAssignmentsList.tsx
"use client";

import { useState } from "react";
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
};

export default function StudentAssignmentsList({
  assignments,
  studentId,
}: {
  assignments: Assignment[];
  studentId: string;
}) {
  const [assignList, setAssignList] = useState(assignments);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);

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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Assignments</h2>
      {assignList.length === 0 && <div>No assignments available yet.</div>}
      {assignList.map((a) => (
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
                  Submitted{a.grade && ` - Grade: ${a.grade}`}
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
