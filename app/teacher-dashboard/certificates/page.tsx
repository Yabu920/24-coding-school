//app/teacher-dashboard/certificates/page.tsx
"use client"

import { useEffect, useState } from "react"

type Certificate = {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseName: string
  issued_at: string
  file_url?: string
}

type Student = {
  id: string
  full_name: string
  email: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [courseName, setCourseName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch certificates and active students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const certRes = await fetch("/api/teacher/certificates")
        const studentsRes = await fetch("/api/teacher/students")
        if (!certRes.ok) throw new Error("Failed to fetch certificates")
        if (!studentsRes.ok) throw new Error("Failed to fetch students")
        const certData = await certRes.json()
        const studentsData = await studentsRes.json()

        setCertificates(certData.certificates || [])
        setStudents(studentsData.students || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudentId || !courseName) return alert("Please fill all fields")
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("studentId", selectedStudentId)
      formData.append("courseName", courseName)
      if (file) formData.append("file", file)

      const res = await fetch("/api/teacher/certificates", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to issue certificate")

      setCertificates(prev => [data.certificate, ...prev])
      alert("Certificate issued successfully")
      // Reset form
      setSelectedStudentId("")
      setCourseName("")
      setFile(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Certificates</h2>

      {/* Issue Certificate Form */}
      <div className="p-6 bg-white shadow rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Issue Certificate</h3>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <select
            required
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.email})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="border px-3 py-2 rounded w-full"
          />

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Issuing..." : "Issue Certificate"}
          </button>
        </form>
      </div>

      {/* Certificates Table */}
      {loading ? (
        <p>Loading certificates...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : certificates.length === 0 ? (
        <p>No certificates issued yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Student</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Issued At</th>
                <th className="px-4 py-2 text-left">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert, idx) => (
                <tr key={cert.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{cert.studentName}</td>
                  <td className="px-4 py-2">{cert.studentEmail}</td>
                  <td className="px-4 py-2">{cert.courseName}</td>
                  <td className="px-4 py-2">
                    {new Date(cert.issued_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {cert.file_url ? (
                      <a
                        href={cert.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


// "use client";

// import { useEffect, useState } from "react";

// type Course = {
//   id: string;
//   name: string;
// };

// type Student = {
//   id: string;
//   full_name: string;
// };

// type Certificate = {
//   id: string;
//   studentId: string;
//   studentName: string;
//   studentEmail: string;
//   courseId: string;
//   courseName: string;
//   issued_at: string;
//   file_url?: string;
// };

// export default function CertificatesPage() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedStudent, setSelectedStudent] = useState("");
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [studentsRes, coursesRes, certRes] = await Promise.all([
//           fetch("/api/teacher/students"),
//           fetch("/api/teacher/courses"),
//           fetch("/api/teacher/certificates"),
//         ]);

//         if (!studentsRes.ok || !coursesRes.ok || !certRes.ok)
//           throw new Error("Failed to fetch data");

//         const studentsData = await studentsRes.json();
//         const coursesData = await coursesRes.json();
//         const certData = await certRes.json();

//         setStudents(studentsData.students);
//         setCourses(coursesData.courses);
//         setCertificates(certData.certificates);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedStudent || !selectedCourse || !file) {
//       alert("Please select a student, a course, and a file");
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("studentId", selectedStudent);
//     formData.append("courseId", selectedCourse);
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/teacher/certificates", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to upload certificate");

//       setCertificates((prev) => [...prev, data.certificate]);
//       setSelectedStudent("");
//       setSelectedCourse("");
//       setFile(null);
//       alert("Certificate uploaded successfully!");
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Certificates</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <>
//           {/* Upload Form */}
//           <div className="mb-6 bg-white p-4 rounded shadow">
//             <h3 className="text-xl font-semibold mb-2">Issue New Certificate</h3>
//             <div className="flex flex-col md:flex-row gap-4 items-center">
//               <select
//                 value={selectedStudent}
//                 onChange={(e) => setSelectedStudent(e.target.value)}
//                 className="px-4 py-2 border rounded flex-1"
//               >
//                 <option value="">Select Student</option>
//                 {students.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.full_name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={selectedCourse}
//                 onChange={(e) => setSelectedCourse(e.target.value)}
//                 className="px-4 py-2 border rounded flex-1"
//               >
//                 <option value="">Select Course</option>
//                 {courses.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name}
//                   </option>
//                 ))}
//               </select>

//               <input type="file" onChange={handleFileChange} />

//               <button
//                 onClick={handleUpload}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//                 disabled={uploading}
//               >
//                 {uploading ? "Uploading..." : "Upload"}
//               </button>
//             </div>
//           </div>

//           {/* Certificates Table */}
//           <div className="overflow-x-auto bg-white shadow rounded-lg">
//             <table className="min-w-full table-auto">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2">#</th>
//                   <th className="px-4 py-2">Student</th>
//                   <th className="px-4 py-2">Email</th>
//                   <th className="px-4 py-2">Course</th>
//                   <th className="px-4 py-2">Issued At</th>
//                   <th className="px-4 py-2">Certificate</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {certificates.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="text-center py-4">
//                       No certificates issued yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   certificates.map((cert, idx) => (
//                     <tr key={cert.id} className="border-t hover:bg-gray-50">
//                       <td className="px-4 py-2">{idx + 1}</td>
//                       <td className="px-4 py-2">{cert.studentName}</td>
//                       <td className="px-4 py-2">{cert.studentEmail}</td>
//                       <td className="px-4 py-2">{cert.courseName}</td>
//                       <td className="px-4 py-2">
//                         {new Date(cert.issued_at).toLocaleDateString()}
//                       </td>
//                       <td className="px-4 py-2">
//                         {cert.file_url ? (
//                           <a
//                             href={cert.file_url}
//                             target="_blank"
//                             className="text-blue-600 hover:underline"
//                           >
//                             View
//                           </a>
//                         ) : (
//                           "-"
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
