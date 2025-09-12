// components/student/StudentHeader.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function StudentHeader({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchNotifications();
    function onDocClick(e: MouseEvent) {
      if (!dropRef.current) return;
      if (!dropRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/student/notifications");
      if (!res.ok) return;
      const json = await res.json();
      setNotifications(json.notifications || []);
    } catch (err) {
      // ignore
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const user = (session?.user as any) ?? {};
  const name = user.full_name ?? user.name ?? "Student";
  const image = user.image ?? user.profile_image_url ?? "/avatar-placeholder.png";

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="md:hidden p-2 rounded hover:bg-gray-100" aria-label="Open sidebar">
          {/* menu icon */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <div>
          <div className="text-lg font-semibold">Student Dashboard</div>
          <div className="text-xs text-gray-500">Welcome back</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => {
              fetchNotifications();
              setOpen(false);
              // optional: open a notifications panel
              setOpen(false);
            }}
            aria-label="Notifications"
          >
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">{unreadCount}</span>
            )}
          </button>
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropRef}>
          <button className="flex items-center gap-2 p-1 rounded hover:bg-gray-100" onClick={() => setOpen((s) => !s)}>
            <img src={image} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            <span className="hidden md:inline">{name}</span>
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z" /></svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50 overflow-hidden">
              <Link href="/student-dashboard/profile"><a className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</a></Link>
              <Link href="/student-dashboard/settings"><a className="block px-4 py-2 text-sm hover:bg-gray-100">Settings</a></Link>
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
