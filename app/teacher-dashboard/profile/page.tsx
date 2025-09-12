"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/teacher/profile");
      if (res.ok) {
        const j = await res.json();
        setUser(j.user);
      } else {
        console.warn("Cannot fetch profile");
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">No profile</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <img src={user.profile_image_url ?? "/default-avatar.png"} className="w-32 h-32 rounded mb-2" />
          <div className="font-semibold">{user.full_name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="mt-4">
            <a href="/teacher-dashboard" className="text-blue-600">Back to dashboard</a>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Editable Profile (use the header dropdown to edit)</h3>
          <p className="text-sm text-gray-500">You can edit your profile and password from the header profile modal as implemented earlier.</p>
        </div>
      </div>
    </div>
  );
}
