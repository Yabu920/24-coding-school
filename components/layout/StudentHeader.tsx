// app/components/layout/StudentHeader.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

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

  // Fetch student profile and notifications on mount
  useEffect(() => {
    async function load() {
      try {
        const [profileRes, notifRes] = await Promise.all([
          fetch("/api/student/profile"),
          fetch("/api/student/notifications"),
        ]);

        if (profileRes.ok) {
          const json = await profileRes.json();
          setStudent(json.user ?? null);
        } else {
          console.warn("Failed to fetch student profile", await profileRes.text());
        }

        if (notifRes.ok) {
          const j = await notifRes.json();
          setNotifications(j.notifications ?? []);
        } else {
          console.warn("Failed to fetch student notifications", await notifRes.text());
        }
      } catch (err) {
        console.error("Error loading header:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Listen for profile updates from profile page
  useEffect(() => {
    function handleProfileUpdate(e: CustomEvent) {
      if (e.detail) {
        setStudent((prev) => ({
          ...prev,
          ...e.detail,
        }));
      }
    }
    window.addEventListener("profileUpdated", handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener);
    };
  }, []);

  if (loading) return <header className="p-4 bg-white shadow">Loading...</header>;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold">Student Dashboard</div>

      <div className="flex items-center space-x-4 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative"
            title="Notifications"
          >
            🔔
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
                <div key={n.id} className={`p-2 rounded hover:bg-gray-100 ${!n.is_read ? "font-semibold" : ""}`}>
                  <p className="text-sm">
                    {n.type === "new_assignment" && "📘 "}
                    {n.type === "new_grade" && "📝 "}
                    {n.type === "new_certificate" && "🎓 "}
                    {n.type === "profile_update" && "👤 "}
                    {n.type === "password_update" && "🔑 "}
                    {n.message}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Clear button */}
              {notifications.length > 0 && (
                <button
                  onClick={async () => {
                    await fetch("/api/student/notifications/clear", { method: "PUT" })
                    setNotifications([])
                  }}
                  className="text-blue-600 text-sm mt-2"
                >
                  Clear all
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
              src={student?.image || "/default-avatar.png"}
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
                    onClick={() => signOut({ callbackUrl: "/login" })}
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
