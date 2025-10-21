
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





