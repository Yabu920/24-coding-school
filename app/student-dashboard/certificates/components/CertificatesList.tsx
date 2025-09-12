// app/student-dashboard/certificates/components/CertificatesList.tsx
"use client";

interface Certificate {
  id: string;
  course_name: string;
  issued_date: string;
  file_url?: string;
}

export default function CertificatesList({ certificates }: { certificates: Certificate[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Certificates</h2>
      {certificates.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">No certificates yet.</div>
      ) : (
        <div className="grid gap-4">
          {certificates.map(c => (
            <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{c.course_name}</div>
                <div className="text-sm text-gray-500">{new Date(c.issued_date).toLocaleDateString()}</div>
              </div>
              {c.file_url ? <a href={c.file_url} className="text-blue-600 hover:underline">Download</a> : <span>-</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
