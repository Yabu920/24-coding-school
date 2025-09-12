// app/teacher-dashboard/layout.tsx
import React from "react";
import TeacherDashboardHeader from "./components/TeacherDashboardHeader";
import TeacherSidebar from "./components/TeacherSidebar";

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col">
        <TeacherDashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

