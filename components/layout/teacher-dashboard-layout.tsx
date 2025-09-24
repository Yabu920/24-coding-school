// components/layout/teacher-dashboard-layout.tsx
"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import NotificationDropdown, { NotificationItem } from "../notification-dropdown";

type Props = {
  children: ReactNode;
};

export default function TeacherDashboardLayout({ children }: Props) {
  const router = useRouter();
  // const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);


  // Fetch notifications
  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const body = await res.json();
        setNotifications(body.notifications ?? []);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  async function markNotificationRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to mark read");
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  }

  async function markAllRead() {
    try {
      const res = await fetch("/api/notifications/mark-all", { method: "PUT" });
      if (!res.ok) throw new Error("Failed to mark all read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogout() {
    setShowProfileMenu(false);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-6 font-bold text-lg border-b border-gray-700">Teacher Dashboard</div>
        <ul className="mt-4">
          <li className="px-6 py-2 hover:bg-gray-700 cursor-pointer">Dashboard Overview</li>
          <li className="px-6 py-2 hover:bg-gray-700 cursor-pointer">View Students</li>
          <li className="px-6 py-2 hover:bg-gray-700 cursor-pointer">My Courses</li>
          <li className="px-6 py-2 hover:bg-gray-700 cursor-pointer">Assignments</li>
          <li className="px-6 py-2 hover:bg-gray-700 cursor-pointer">Certificates</li>
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-3 relative z-10">
          <h1 className="text-lg font-semibold text-gray-800">Welcome, yeabsra</h1>
          <div className="flex items-center space-x-4 relative">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications((s) => !s)}
                className="relative text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <FiBell size={20} />
                {notifications.filter((n) => n.type === "message" && !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                    {notifications.filter((n) => n.type === "message" && !n.read).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  loading={false}
                  onMarkRead={markNotificationRead}
                  onMarkAllRead={markAllRead}
                />
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((s) => !s)}
                className="flex items-center gap-3 focus:outline-none"
              >
                
                <span className="hidden sm:inline-block text-sm text-gray-700">yeabsra</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                  <ul>
                    <li
                      onClick={() => { router.push("/teacher-dashboard/profile"); setShowProfileMenu(false); }}
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                    >
                      <FiUser /> Profile
                    </li>
                    <li
                      onClick={() => { router.push("/teacher-dashboard/settings"); setShowProfileMenu(false); }}
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                    >
                      <FiSettings /> Settings
                    </li>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                    >
                      <FiLogOut /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
