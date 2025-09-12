
// // components/layout/admin-header.tsx
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
// import { useRouter } from "next/navigation";

// type NotificationItem = {
//   id: string;
//   type: "message" | "announcement";
//   title?: string;
//   content: string;
//   senderName?: string | null;
//   time: string; // ISO
//   read?: boolean;
// };

// export default function AdminHeader() {
//   const router = useRouter();
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const [profileName, setProfileName] = useState<string | null>(null);
//   const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [loadingNotifications, setLoadingNotifications] = useState(false);

//   const notifRef = useRef<HTMLDivElement | null>(null);
//   const profileRef = useRef<HTMLDivElement | null>(null);

//   const unreadCount = notifications.filter((n) => n.type === "message" && !n.read).length;

//   // Fetch profile for header
//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         const res = await fetch("/api/admin/profile");
//         if (!res.ok) throw new Error("Failed to fetch profile");
//         const body = await res.json();
//         const u = body.user;
//         setProfileName(u?.full_name ?? null);
//         setProfileAvatar(u?.profile_image_url ?? null);
//       } catch (err) {
//         console.error("Failed to load profile for header:", err);
//       }
//     }
//     fetchProfile();
//   }, []);

//   // Fetch notifications
//   useEffect(() => {
//     async function loadNotifications() {
//       try {
//         setLoadingNotifications(true);
//         const res = await fetch("/api/notifications");
//         if (!res.ok) throw new Error("Failed to fetch notifications");
//         const body = await res.json();
//         setNotifications(body.notifications ?? []);
//       } catch (err) {
//         console.error("Failed to load notifications:", err);
//       } finally {
//         setLoadingNotifications(false);
//       }
//     }

//     loadNotifications();
//     const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
//     return () => clearInterval(interval);
//   }, []);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     function onDocClick(e: MouseEvent) {
//       if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
//         setShowNotifications(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
//         setShowProfileMenu(false);
//       }
//     }
//     document.addEventListener("click", onDocClick);
//     return () => document.removeEventListener("click", onDocClick);
//   }, []);

//   // Mark a notification as read
//   async function markNotificationRead(id: string) {
//     try {
//       const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
//       if (!res.ok) throw new Error("Failed to mark read");
//       setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   // Mark all as read
//   async function markAllRead() {
//     try {
//       const res = await fetch("/api/notifications/mark-all", { method: "PUT" });
//       if (!res.ok) throw new Error("Failed to mark all");
//       setNotifications((prev) => prev.map((n) => (n.type === "message" ? { ...n, read: true } : n)));
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   const handleLogout = async () => {
//     setShowProfileMenu(false);
//     await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
//     router.replace("/login");
//   };

//   return (
//     <header className="flex justify-between items-center bg-white shadow px-6 py-3 relative z-10">
//       <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

//       <div className="flex items-center space-x-4 relative">
//         {/* Notifications */}
//         <div className="relative" ref={notifRef}>
//           <button
//             onClick={() => setShowNotifications((s) => !s)}
//             className="relative text-gray-700 hover:text-gray-900 focus:outline-none"
//             aria-label="Notifications"
//           >
//             <FiBell size={20} />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {showNotifications && (
//             <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
//               <div className="flex items-center justify-between px-4 py-2 border-b">
//                 <h4 className="font-semibold text-gray-700">Notifications</h4>
//                 <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">
//                   Mark all read
//                 </button>
//               </div>

//               <div className="max-h-64 overflow-auto">
//                 {loadingNotifications ? (
//                   <div className="px-4 py-4 text-sm text-gray-500">Loading...</div>
//                 ) : notifications.length === 0 ? (
//                   <div className="px-4 py-4 text-sm text-gray-500">No notifications</div>
//                 ) : (
//                   <ul>
//                     {notifications.map((note) => (
//                       <li
//                         key={`${note.type}-${note.id}`}
//                         onClick={() => {
//                           if (note.type === "message") markNotificationRead(note.id);
//                         }}
//                         className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${
//                           note.type === "message" && !note.read ? "bg-gray-50" : ""
//                         }`}
//                       >
//                         <div className="flex-1">
//                           <div className="flex justify-between">
//                             <div className="text-sm font-medium text-gray-800">
//                               {note.type === "message" ? note.senderName ?? "Message" : note.title ?? "Announcement"}
//                             </div>
//                             <div className="text-xs text-gray-400">{new Date(note.time).toLocaleString()}</div>
//                           </div>
//                           <div className="text-sm text-gray-600 mt-1">{note.content}</div>
//                         </div>
//                         {note.type === "message" && !note.read && (
//                           <div className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">New</div>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Profile */}
//         <div className="relative" ref={profileRef}>
//           <button onClick={() => setShowProfileMenu((s) => !s)} className="flex items-center gap-3 focus:outline-none">
//             {profileAvatar ? (
//               <img src={profileAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
//             ) : (
//               <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 border">
//                 {profileName?.[0]?.toUpperCase() ?? "A"}
//               </div>
//             )}
//             <span className="hidden sm:inline-block text-sm text-gray-700">{profileName ?? "Admin"}</span>
//           </button>

//           {showProfileMenu && (
//             <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
//               <ul>
//                 <li
//                   onClick={() => {
//                     router.push("/admin-dashboard/profile");
//                     setShowProfileMenu(false);
//                   }}
//                   className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
//                 >
//                   <FiUser /> Profile
//                 </li>
//                 <li
//                   onClick={() => {
//                     router.push("/admin-dashboard/settings");
//                     setShowProfileMenu(false);
//                   }}
//                   className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
//                 >
//                   <FiSettings /> Settings
//                 </li>
//                 <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
//                   <FiLogOut /> Logout
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }




// components/layout/admin-header.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useRouter } from "next/navigation";

type NotificationItem = {
  id: string;
  type: "message" | "announcement" | "new_user" | "new_course";
  title?: string;
  content: string;
  senderName?: string | null;
  time: string; // ISO
  read?: boolean;
};

export default function AdminHeader() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Count all unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch profile info
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const body = await res.json();
        const u = body.user;
        setProfileName(u?.full_name ?? null);
        setProfileAvatar(u?.profile_image_url ?? null);
      } catch (err) {
        console.error("Failed to load profile for header:", err);
      }
    }
    fetchProfile();
  }, []);

  // Fetch notifications
  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoadingNotifications(true);
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const body = await res.json();
        setNotifications(body.notifications ?? []);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoadingNotifications(false);
      }
    }

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Mark single notification as read
  async function markNotificationRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to mark read");
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  }

  // Mark all notifications as read
  async function markAllRead() {
    try {
      const res = await fetch("/api/notifications/mark-all", { method: "PUT" });
      if (!res.ok) throw new Error("Failed to mark all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  }

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
  };

  return (
    <header className="flex justify-between items-center bg-white shadow px-6 py-3 relative z-10">
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      <div className="flex items-center space-x-4 relative">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((s) => !s)}
            className="relative text-gray-700 hover:text-gray-900 focus:outline-none"
            aria-label="Notifications"
          >
            <FiBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h4 className="font-semibold text-gray-700">Notifications</h4>
                <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">
                  Mark all read
                </button>
              </div>

              <div className="max-h-64 overflow-auto">
                {loadingNotifications ? (
                  <div className="px-4 py-4 text-sm text-gray-500">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-gray-500">No notifications</div>
                ) : (
                  <ul>
                    {notifications.map((note) => (
                      <li
                        key={note.id}
                        onClick={() => markNotificationRead(note.id)}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${
                          !note.read ? "bg-gray-50" : ""
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium text-gray-800">
                              {note.type === "message"
                                ? note.senderName ?? "Message"
                                : note.type === "announcement"
                                ? note.title ?? "Announcement"
                                : note.type === "new_user"
                                ? "New User"
                                : note.type === "new_course"
                                ? "New Course"
                                : note.title ?? note.type}
                            </div>
                            <div className="text-xs text-gray-400">{new Date(note.time).toLocaleString()}</div>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{note.content}</div>
                        </div>
                        {!note.read && (
                          <div className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">New</div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfileMenu((s) => !s)} className="flex items-center gap-3 focus:outline-none">
            {profileAvatar ? (
              <img src={profileAvatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 border">
                {profileName?.[0]?.toUpperCase() ?? "A"}
              </div>
            )}
            <span className="hidden sm:inline-block text-sm text-gray-700">{profileName ?? "Admin"}</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
              <ul>
                <li
                  onClick={() => {
                    router.push("/admin-dashboard/profile");
                    setShowProfileMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <FiUser /> Profile
                </li>
                <li
                  onClick={() => {
                    router.push("/admin-dashboard/settings");
                    setShowProfileMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <FiSettings /> Settings
                </li>
                <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer">
                  <FiLogOut /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
