// app/teacher-dashboard/components/TeacherDashboardHeader.tsx
"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { signOut } from "next-auth/react";

type TeacherDTO = {
  id: string;
  full_name: string;
  email: string;
  username?: string;
  phone?: string | null;
  profile_image_url?: string | null;
};

type NotificationDTO = {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type?: "assignment_submitted" | "new_assignment" | "new_grade" | string;
};

export default function TeacherDashboardHeader() {
  const [teacher, setTeacher] = useState<TeacherDTO | null>(null);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // profile form
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, nRes] = await Promise.all([
          fetch("/api/teacher/profile"),
          fetch("/api/teacher/notifications"),
        ]);

        if (pRes.ok) {
          const json = await pRes.json();
          setTeacher(json.user ?? json.teacher ?? null);
          const user = json.user ?? json.teacher;
          if (user) {
            setFullName(user.full_name ?? "");
            setUsername(user.username ?? "");
            setPhone(user.phone ?? "");
          }
        } else {
          console.warn("Failed to fetch profile", await pRes.text());
        }

        if (nRes.ok) {
          const j = await nRes.json();
          setNotifications(j.notifications ?? []);
        } else {
          // 404 is ok if no notifications route exists yet
          console.warn(
            "Failed to fetch teacher notifications",
            await nRes.text()
          );
        }
      } catch (err) {
        console.error("Header load error:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function markNotificationRead(id: string) {
    try {
      const res = await fetch(`/api/teacher/notifications/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (err) {
      console.error("mark read error", err);
    }
  }

  async function handleProfileSave() {
    setSavingProfile(true);
    try {
      const form = new FormData();
      form.append("full_name", fullName);
      form.append("username", username);
      form.append("phone", phone);
      if (file) form.append("profile_image", file);

      const res = await fetch("/api/teacher/profile", {
        method: "PATCH",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");
      setTeacher(data.user ?? data.teacher);
      // update fields from server response (if sent)
      const u = data.user ?? data.teacher;
      if (u) {
        setFullName(u.full_name ?? "");
        setUsername(u.username ?? "");
        setPhone(u.phone ?? "");
      }
      alert("Profile updated");
      setShowProfileModal(false);
    } catch (err: any) {
      alert(err.message || "Error saving profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (!oldPassword || !newPassword) {
      alert("Enter old and new password");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/teacher/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to change password");
      alert("Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowProfileModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  if (loadingProfile)
    return <header className="p-4 bg-white shadow">Loading...</header>;

  return (
    <>
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Teacher Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif((s) => !s)}
              aria-label="Notifications"
              className="relative p-2 rounded hover:bg-gray-100"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-96 bg-white border rounded shadow z-50 p-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Notifications</h4>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded ${
                          n.is_read ? "bg-gray-50" : "bg-blue-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-sm flex items-center gap-1">
                            {/* 🔹 Show icon depending on type */}
                            {n.type === "assignment_submitted" && (
                              <span>📥</span>
                            )}
                            {n.type === "new_assignment" && <span>📘</span>}
                            {n.type === "new_grade" && <span>📝</span>}
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
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((s) => !s)}
              className="flex items-center gap-2 rounded p-1 hover:bg-gray-100"
            >
              <img
                src={teacher?.profile_image_url || "/admin.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:inline">
                {teacher?.full_name ?? teacher?.email}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Profile
                </button>

                <button className="w-full text-left p-2 hover:bg-gray-100 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left p-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-lg rounded shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                {teacher?.profile_image_url && (
                  <img
                    src={teacher.profile_image_url}
                    alt="preview"
                    className="w-24 h-24 rounded object-cover mt-2"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Full name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mb-1 mt-2">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded p-2"
                />
                <label className="block text-sm font-medium mb-1 mt-2">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSave}
                disabled={savingProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {savingProfile ? "Saving..." : "Save"}
              </button>
            </div>

            <hr className="my-4" />

            <h4 className="text-md font-semibold mb-2">Change password</h4>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="password"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded p-2"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                {changingPassword ? "Updating..." : "Update password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded ${n.is_read ? "bg-gray-50" : "bg-blue-50"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-sm">{n.message}</div>
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
                    ))
                  )}
                </div> */
}
