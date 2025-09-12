// // app/student-dashboard/layout.tsx
// import React from "react";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";
// import StudentShell from "../../components/layout/student-shell" // we'll create this client component

// export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "student") {
//     redirect("/login");
//   }

//   // session exists and role is student -> render client shell (SessionProvider is in client layout)
//   return (
//     <StudentShell user={session.user}>
//       {children}
//     </StudentShell>
//   );
// }



// // app/student-dashboard/layout.tsx
// import React from "react";
// import StudentHeader from "@/components/layout/StudentHeader";

// export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <StudentHeader />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-6 gap-6">
//         {/* Sidebar */}
//         <aside className="md:col-span-1 bg-white rounded shadow p-4">
//           <nav className="flex flex-col space-y-2">
//             <a href="/student-dashboard" className="px-3 py-2 rounded hover:bg-gray-50">Overview</a>
//             <a href="/student-dashboard/courses" className="px-3 py-2 rounded hover:bg-gray-50">My Courses</a>
//             <a href="/student-dashboard/assignments" className="px-3 py-2 rounded hover:bg-gray-50">Assignments</a>
//             <a href="/student-dashboard/certificates" className="px-3 py-2 rounded hover:bg-gray-50">Certificates</a>
//             <a href="/student-dashboard/profile" className="px-3 py-2 rounded hover:bg-gray-50">Profile</a>
//             <a href="/student-dashboard/settings" className="px-3 py-2 rounded hover:bg-gray-50">Settings</a>
//           </nav>
//         </aside>

//         {/* Main content */}
//         <main className="md:col-span-5">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



// app/student-dashboard/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import StudentHeader from "@/components/layout/StudentHeader";
import StudentSidebar from "@/components/layout/StudentSidebar";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <StudentHeader />
        <div className="flex flex-1">
          <StudentSidebar />
          <main className="flex-1 bg-gray-100 p-4">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}





