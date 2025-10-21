//app/reset-password/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [Confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Invalid reset link");

    if(newPassword !== Confirm){
      return alert("passwords do not match");
    }
    if(newPassword.length < 6){
      return alert("password must be at least 6 charaters");
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (data.message) window.location.href = "/";
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={Confirm} 
          onChange={(e)=>setConfirm(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}
