// components/student/StudentDashboardShell.tsx
"use client";

import { ReactNode, useState } from "react";
import StudentHeader from "./StudentHeader";
import StudentSidebar from "./StudentSidebar";

export default function StudentDashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar collapsed={collapsed} onToggle={() => setCollapsed((s) => !s)} />
      <div className="flex-1 flex flex-col">
        <StudentHeader onToggleSidebar={() => setCollapsed((s) => !s)} />
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
