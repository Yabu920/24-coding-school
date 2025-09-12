// components/layout/student-shell.tsx
"use client";
import React, { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function StudentShell({ children, user }: { children: ReactNode; user: any }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="h-16 flex items-center px-4 border-b">
          <span className="font-bold text-lg">School</span>
        </div>
        <nav className="p-4 space-y-1">
          <Link className="block p-2 rounded hover:bg-gray-100" href="/student-dashboard">
            Dashboard
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" href="/student-dashboard/courses">
            Courses
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" href="/student-dashboard/assignments">
            Assignments
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" href="/student-dashboard/live-classes">
            Live Classes
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" href="/student-dashboard/certificates">
            Certificates
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-100" href="/student-dashboard/profile">
            Profile
          </Link>
        </nav>
        <div className="mt-auto p-4">
          <button
            className="w-full p-2 rounded bg-gray-100 text-sm"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top header */}
        <header className="h-16 bg-white border-b px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2" onClick={() => setCollapsed((c) => !c)}>
              {/* hamburger */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 className="text-xl font-semibold">Student Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* notifications icon (placeholder) */}
            <button className="p-2 rounded hover:bg-gray-100" aria-label="Notifications">
              🔔
            </button>

            {/* profile */}
            <div className="relative">
              <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-100" onClick={() => {}}>
                {user.image ? (
                  // image can be relative URL
                  <img src={user.image} alt={user.full_name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                    {user.full_name?.split(" ").map((s:any) => s[0]).slice(0,2).join("")}
                  </div>
                )}
                <span className="hidden md:inline-block">{user.full_name}</span>
              </button>

              {/* drop-down */}
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-sm p-2 z-50">
                <button className="text-left w-full p-2 hover:bg-gray-50 rounded" onClick={() => router.push("/student-dashboard/profile")}>Profile</button>
                <button className="text-left w-full p-2 hover:bg-gray-50 rounded" onClick={() => router.push("/student-dashboard/profile")}>Settings</button>
                <button className="text-left w-full p-2 hover:bg-gray-50 rounded" onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
              </div>
            </div>
          </div>
        </header>

        {/* content */}
        <main className="p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
