// app/student-dashboard/profile/page.tsx
"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface StudentDTO {
  full_name: string;
  email: string;
  username: string;
  phone?: string;
  image?: string;
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState<StudentDTO | null>(null);
  const [previewImage, setPreviewImage] = useState("/default-avatar.png");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Load profile from server
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/student/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setStudent(data.user ?? null);
        setPreviewImage(data.user?.image || "/default-avatar.png");
      } catch (err) {
        console.error("Error fetching student profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setProfileLoading(true);
    setProfileMessage("");

    try {
      const formData = new FormData();
      formData.append("fullName", student.full_name);
      formData.append("email", student.email);
      formData.append("username", student.username);
      formData.append("phone", student.phone ?? "");
      if (profileImageFile) formData.append("profileImage", profileImageFile);

      const res = await fetch("/api/student/profile", { method: "PATCH", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setProfileMessage("Profile updated successfully!");
      setStudent(data.user);
      setPreviewImage(data.user.image || "/default-avatar.png");

      // Update header immediately
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: {
            full_name: data.user.full_name,
            username: data.user.username,
            image: data.user.image || "/default-avatar.png",
          },
        })
      );
    } catch (err: any) {
      setProfileMessage(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/student/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setPasswordMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Info */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        {profileMessage && <p className="mb-4 text-green-600">{profileMessage}</p>}
        {student && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <img src={previewImage} alt="Profile" className="w-20 h-20 rounded-full border" />
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div>
              <label className="block font-medium">Full Name</label>
              <input
                type="text"
                value={student.full_name}
                onChange={(e) => setStudent({ ...student, full_name: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={student.email}
                onChange={(e) => setStudent({ ...student, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Username</label>
              <input
                type="text"
                value={student.username}
                onChange={(e) => setStudent({ ...student, username: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                value={student.phone ?? ""}
                onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {profileLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}
      </div>

      {/* Password Update */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        {passwordMessage && <p className="mb-4 text-red-600">{passwordMessage}</p>}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
