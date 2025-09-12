// components/student/StudentSidebar.tsx
"use client";

import Link from "next/link";

export default function StudentSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void; }) {
  return (
    <aside className={`bg-white border-r transition-all duration-150 ${collapsed ? "w-16" : "w-64"} hidden md:block`}>
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold">24CS</div>
          {!collapsed && <div className="text-sm text-gray-600">Student</div>}
        </div>
        <button onClick={onToggle} aria-label="Toggle sidebar" className="p-1 rounded hover:bg-gray-100">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      <nav className="p-4 space-y-1">
        <SidebarLink href="/student-dashboard" label="Overview" collapsed={collapsed} />
        <SidebarLink href="/student-dashboard/courses" label="My Courses" collapsed={collapsed} />
        <SidebarLink href="/student-dashboard/assignments" label="Assignments" collapsed={collapsed} />
        <SidebarLink href="/student-dashboard/certificates" label="Certificates" collapsed={collapsed} />
        <SidebarLink href="/student-dashboard/profile" label="Profile" collapsed={collapsed} />
        <SidebarLink href="/student-dashboard/settings" label="Settings" collapsed={collapsed} />
      </nav>
    </aside>
  );
}

function SidebarLink({ href, label, collapsed }: { href: string; label: string; collapsed: boolean; }) {
  return (
    <Link href={href}>
      <a className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
        <span className="w-6 h-6 flex items-center justify-center text-gray-600">
          {/* simple icon circle */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>
        </span>
        {!collapsed && <span className="text-sm">{label}</span>}
      </a>
    </Link>
  );
}
