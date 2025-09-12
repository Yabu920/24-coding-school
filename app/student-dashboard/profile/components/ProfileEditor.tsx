// app/student-dashboard/profile/components/ProfileEditor.tsx
"use client";
import React, { useState } from "react";

export default function ProfileEditor({ user }: any) {
  const [form, setForm] = useState({
    full_name: user.full_name || "",
    username: user.username || "",
    phone: user.phone || ""
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("full_name", form.full_name);
    fd.append("username", form.username);
    fd.append("phone", form.phone);
    if (avatar) fd.append("avatar", avatar);
    try {
      const res = await fetch("/api/student/profile", { method: "PATCH", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      alert("Profile updated");
      location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (oldP: string, newP: string, confirm: string) => {
    if (newP !== confirm) { alert("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/student/profile/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: oldP, newPassword: newP }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      alert("Password updated");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-2xl">
      <h3 className="font-semibold mb-3">Edit Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Full name</label>
          <input className="w-full border p-2 rounded" value={form.full_name} onChange={(e) => setForm({...form, full_name: e.target.value})} />
        </div>
        <div>
          <label className="text-sm">Username</label>
          <input className="w-full border p-2 rounded" value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Phone</label>
          <input className="w-full border p-2 rounded" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Profile picture</label>
          <input type="file" onChange={(e) => setAvatar(e.target.files?.[0] ?? null)} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave} disabled={loading}>Save</button>
      </div>

      <hr className="my-4" />

      <ChangePasswordForm onSubmit={handlePasswordChange} loading={loading} />
    </div>
  );
}

function ChangePasswordForm({ onSubmit, loading }: { onSubmit: (a:string,b:string,c:string)=>void, loading:boolean }) {
  const [oldP, setOldP] = useState("");
  const [newP, setNewP] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div>
      <h3 className="font-semibold mb-2">Change Password</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input type="password" placeholder="Old password" value={oldP} onChange={(e)=>setOldP(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="New password" value={newP} onChange={(e)=>setNewP(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="Confirm password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="border p-2 rounded" />
      </div>
      <div className="mt-3">
        <button disabled={loading} onClick={()=> onSubmit(oldP, newP, confirm)} className="px-4 py-2 bg-red-600 text-white rounded">Update password</button>
      </div>
    </div>
  );
}
