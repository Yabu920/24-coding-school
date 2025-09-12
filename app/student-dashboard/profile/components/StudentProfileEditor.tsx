"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function StudentProfileEditor() {
  const { data: session } = useSession();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize form with session data
  useEffect(() => {
    if (session) {
      setFullName(session.user.full_name);
      setEmail(session.user.email);
      setUsername(session.user.username);
      setPhone(session.user.phone || "");
      setPreview(session.user.image);
    }
  }, [session]);

  // Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("phone", phone);
    if (profileImage) formData.append("profile_image", profileImage);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to update profile");
      }

      const updatedUser = await res.json();

      // Update header in real-time
      const event = new CustomEvent("profileUpdated", { detail: updatedUser });
      window.dispatchEvent(event);

      setMessage("Profile updated successfully!");
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">Edit Profile</h2>

      {/* Profile Image */}
      <div className="flex items-center space-x-4">
        <img
          src={preview || "/default-avatar.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {/* User Info Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && <p className="text-sm text-green-600">{message}</p>}
    </div>
  );
}
