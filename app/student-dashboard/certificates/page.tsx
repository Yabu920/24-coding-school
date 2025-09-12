// // app/student-dashboard/certificates/page.tsx
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export default async function StudentCertificatesPage() {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "student") return <div>Access denied</div>;
//   const student = await prisma.students.findUnique({ where: { user_id: session.user.id } });

//   const certs = await prisma.certificates.findMany({
//     where: { student_id: student?.id },
//     orderBy: { issued_date: "desc" }
//   });

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Certificates</h2>
//       {certs.length === 0 ? (
//         <div className="bg-white p-4 rounded shadow">No certificates yet.</div>
//       ) : (
//         <div className="grid gap-4">
//           {certs.map(c => (
//             <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
//               <div>
//                 <div className="font-semibold">{c.course_name}</div>
//                 <div className="text-sm text-gray-500">{new Date(c.issued_date).toLocaleDateString()}</div>
//               </div>
//               {c.file_url ? <a href={c.file_url} className="text-blue-600 hover:underline">Download</a> : <span>-</span>}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

//app/student-dashboard/certificates/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student")
    return <div>Access denied</div>;

  const student = await prisma.students.findUnique({
    where: { user_id: session.user.id },
  });

  const certs = await prisma.certificates.findMany({
    where: { student_id: student?.id },
    orderBy: { issued_date: "desc" },
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">🎓 Certificates</h2>
      {certs.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-600">
          No certificates yet.
        </div>
      ) : (
        <div className="grid gap-6">
          {certs.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-lg font-semibold">{c.course_name}</h3>
                <p className="text-sm text-gray-500">
                  Issued: {new Date(c.issued_date).toLocaleDateString()}
                </p>
              </div>
              {c.file_url ? (
                <a
                  href={c.file_url}
                  download
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download
                </a>
              ) : (
                <span className="text-gray-400">No file</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

