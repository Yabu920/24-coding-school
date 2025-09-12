// "use client"

// import { useState } from "react"
// import Image from "next/image"

// export default function AdminProfilePage() {
//   const [form, setForm] = useState({
//     fullname: "Admin User",
//     email: "admin@example.com",
//     username: "admin",
//     phone: "+251900000000",
//   })
//   const [password, setPassword] = useState({ current: "", newPass: "", confirmPass: "" })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword({ ...password, [e.target.name]: e.target.value })
//   }

//   const handleSave = () => {
//     alert("Profile updated successfully ✅")
//   }

//   const handlePasswordSave = () => {
//     if (password.newPass !== password.confirmPass) {
//       alert("❌ Passwords do not match!")
//       return
//     }
//     alert("Password changed successfully 🔑")
//   }

//   return (
//     <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-lg shadow">
//       <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

//       {/* Profile Picture */}
//       <div className="flex items-center space-x-4 mb-6">
//         <Image
//           src="/admin.png" // dynamic later
//           alt="Admin Avatar"
//           width={80}
//           height={80}
//           className="rounded-full border"
//         />
//         <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
//           Change Picture
//         </button>
//       </div>

//       {/* Profile Info */}
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Full Name</label>
//           <input
//             type="text"
//             name="fullname"
//             value={form.fullname}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg mt-1"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg mt-1"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg mt-1"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg mt-1"
//           />
//         </div>

//         <button
//           onClick={handleSave}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Save Changes
//         </button>
//       </div>

//       {/* Change Password */}
//       <div className="mt-10 border-t pt-6">
//         <h2 className="text-xl font-semibold mb-4">Change Password</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Current Password</label>
//             <input
//               type="password"
//               name="current"
//               value={password.current}
//               onChange={handlePasswordChange}
//               className="w-full px-3 py-2 border rounded-lg mt-1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">New Password</label>
//             <input
//               type="password"
//               name="newPass"
//               value={password.newPass}
//               onChange={handlePasswordChange}
//               className="w-full px-3 py-2 border rounded-lg mt-1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Confirm New Password</label>
//             <input
//               type="password"
//               name="confirmPass"
//               value={password.confirmPass}
//               onChange={handlePasswordChange}
//               className="w-full px-3 py-2 border rounded-lg mt-1"
//             />
//           </div>
//           <button
//             onClick={handlePasswordSave}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Update Password
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


// app/admin/profile/page.tsx
// app/admin-dashboard/profile/page.tsx
"use client";

import { useEffect, useState, ChangeEvent } from "react";

type User = {
  id: string;
  role: string;
  full_name: string;
  email: string;
  username: string;
  phone: string | null;
  profile_image_url: string | null;
  status?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        const u = data.user as User;
        setUser(u);
        setFullName(u.full_name || "");
        setEmail(u.email || "");
        setUsername(u.username || "");
        setPhone(u.phone || "");
        setAvatarPreview(u.profile_image_url || null);
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setAvatarFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("full_name", fullName);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("username", username);
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update profile");
      }

      const data = await res.json();
      setUser(data.user);
      setFullName(data.user.full_name || "");
      setEmail(data.user.email || "");
      setUsername(data.user.username || "");
      setPhone(data.user.phone || "");
      setAvatarPreview(data.user.profile_image_url || null);
      alert("✅ Profile updated successfully");
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      alert(err.message || "❌ Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please enter current and new password");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Failed to update password");
      }

      alert("🔑 Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      console.error("Password update error:", err);
      alert(err.message || "Failed to update password");
    }
  };

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!user) return <div className="p-6">Could not load profile</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {avatarPreview ? (
              // Next/Image could be used but for preview, <img> is fine
              // for production you might want to use <Image />
              // and keep URLs absolute or from public folder.
              // If `avatarPreview` is `/uploads/...` it will work.
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-gray-600">
                {user.full_name?.[0]?.toUpperCase() ?? "A"}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Profile</button>
        </div>
      </form>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold mb-3">Change Password</h2>
        <div className="space-y-3 max-w-md">
          <input
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            placeholder="Current password"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New password"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            type="password"
            placeholder="Confirm new password"
            className="w-full border px-3 py-2 rounded"
          />
          <div>
            <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-green-600 text-white rounded">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



