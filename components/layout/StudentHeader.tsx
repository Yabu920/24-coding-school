
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {Bell, ChevronDown} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface StudentDTO {
  id: string;
  full_name: string;
  email: string;
  username?: string;
  phone?: string | null;
  image?: string | null;
}

export default function StudentHeader() {
  const { data: session } = useSession();
  const [student, setStudent] = useState<StudentDTO | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Load profile and notifications
  async function loadData() {
    try {
      const [profileRes, notifRes] = await Promise.all([
        fetch("/api/student/profile"),
        fetch("/api/student/notifications"),
      ]);

      if (profileRes.ok) {
        const json = await profileRes.json();
        setStudent(json.user ?? null);
      }

      if (notifRes.ok) {
        const j = await notifRes.json();
        setNotifications(j.notifications ?? []);
      }
    } catch (err) {
      console.error("Error loading header:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Mark single notification as read
  async function markNotificationRead(id: string) {
  try {
    const res = await fetch(`/api/student/notifications/${id}`, { method: "PATCH" });
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } else {
      console.error("Failed to mark read:", await res.text());
    }
  } catch (err) {
    console.error("Error marking notification read", err);
  }
}


  // Mark all notifications as read
  async function markAllRead() {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) => fetch(`/api/student/notifications/${n.id}`, { method: "PATCH" }))
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all notifications read", err);
    }
  }

  if (loading) return <header className="p-4 bg-white shadow">Loading...</header>;

  return (
    <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold">Student Dashboard</div>

      <div className="flex items-center space-x-4 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif((s) => !s) }
            className="relative"
            title="Notifications"
          >
            {/* setShowNotif(!showNotif) */}
            <Bell className="w-6 h-6"/>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-2 z-50 max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="text-gray-500 text-sm">No notifications</p>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2 rounded ${n.is_read ? "bg-gray-50" : "bg-blue-50"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-sm flex items-center gap-1">
                      {n.type === "new_assignment" && <span>📘</span>}
                      {n.type === "new_grade" && <span>📝</span>}
                      {n.type === "assignment_submitted" && <span>📥</span>}
                      {n.type === "new_certificate" && <span>🎓</span>}
                      {n.type === "profile_update" && <span>👤</span>}
                      <span>{n.message}</span>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="text-xs text-blue-600 ml-2"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </div>
              ))}

              {/* Mark all read button */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-blue-600 text-sm mt-2 w-full text-left"
                >
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2"
          >
            <img
              src={student?.image || "/admin.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full border"
            />
            <span>{student?.username || student?.full_name || "Student"}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded z-50">
              <ul>
                <li>
                  <a
                    href="/student-dashboard/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="/student-dashboard/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
