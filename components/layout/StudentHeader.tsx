// // app/components/layout/StudentHeader.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";

// interface Notification {
//   id: string;
//   type: string;
//   message: string;
//   is_read: boolean;
//   created_at: string;
// }

// interface StudentDTO {
//   id: string;
//   full_name: string;
//   email: string;
//   username?: string;
//   phone?: string | null;
//   image?: string | null;
// }

// export default function StudentHeader() {
//   const { data: session } = useSession();
//   const [student, setStudent] = useState<StudentDTO | null>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showNotif, setShowNotif] = useState(false);
//   const [seen, setSeen] = useState<boolean>(false);

//   // Function to load profile and notifications
//   async function loadData() {
//     try {
//       const [profileRes, notifRes] = await Promise.all([
//         fetch("/api/student/profile"),
//         fetch("/api/student/notifications"),
//       ]);

//       if (profileRes.ok) {
//         const json = await profileRes.json();
//         setStudent(json.user ?? null);
//       } else {
//         console.warn("Failed to fetch student profile", await profileRes.text());
//       }

//       if (notifRes.ok) {
//         const j = await notifRes.json();
//         setNotifications(j.notifications ?? []);
//       } else {
//         console.warn("Failed to fetch student notifications", await notifRes.text());
//       }
//     } catch (err) {
//       console.error("Error loading header:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Poll for new notifications every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("/api/student/notifications");
//         if (res.ok) {
//           const j = await res.json();
//           setNotifications(j.notifications ?? []);
//         }
//       } catch (err) {
//         console.error("Polling notifications failed:", err);
//       }
//     }, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   // Listen for profile updates
//   useEffect(() => {
//     function handleProfileUpdate(e: CustomEvent) {
//       if (e.detail) {
//         setStudent((prev) => ({
//           ...prev,
//           ...e.detail,
//         }));
//       }
//     }
//     window.addEventListener("profileUpdated", handleProfileUpdate as EventListener);
//     return () => {
//       window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener);
//     };
//   }, []);

//   if (loading) return <header className="p-4 bg-white shadow">Loading...</header>;

//   //const unreadCount = notifications.filter((n) => !n.is_read).length;

//   const handleBellClick = async () => {
//   setShowNotif(!showNotif);

//   if (!seen) {
//     setSeen(true); // remove red badge visually

//     try {
//       await fetch("/api/student/notifications/mark-all-read", {
//         method: "PUT", // match your backend method
//       });

//       // update local notifications state
//       setNotifications((prev) =>
//         prev.map((n) => ({ ...n, is_read: true }))
//       );
//     } catch (err) {
//       console.error("Failed to mark all notifications as read:", err);
//     }
//   }
// };
// const unreadCount = !seen ? notifications.filter((n) => !n.is_read).length : 0;

//   // Handle clicking a notification
//   const handleNotificationClick = async (notif: Notification) => {
//     let href = "#";
//     if (notif.type === "new_assignment") href = "/student-dashboard/assignments";
//     else if (notif.type === "new_grade") href = "/student-dashboard/grades";
//     else if (notif.type === "new_certificate") href = "/student-dashboard/certificates";
//     else if (notif.type === "profile_update") href = "/student-dashboard/profile";

//     // Optionally mark as read
//     try {
//       await fetch(`/api/student/notifications/${notif.id}/read`, { method: "PUT" });
//       setNotifications((prev) =>
//         prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
//       );
//     } catch (err) {
//       console.error("Failed to mark notification as read:", err);
//     }

//     window.location.href = href; // Redirect
//   };

//   return (
//     <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
//       <div className="text-xl font-bold">Student Dashboard</div>

//       <div className="flex items-center space-x-4 relative">
//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={(handleBellClick) => setShowNotif(!showNotif)}
//             className="relative"
//             title="Notifications"
//           >
//             🔔
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
//                 {unreadCount}
//               </span>
//             )}
//           </button>
//                           {/* <button
//   onClick={handleBellClick}
//   className="relative"
//   title="Notifications"
// >
//   🔔
//   {unreadCount > 0 && (
//     <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
//       {unreadCount}
//     </span>
//   )}
// </button> */}

//           {showNotif && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-2 z-50 max-h-80 overflow-y-auto">
//               {notifications.length === 0 && (
//                 <p className="text-gray-500 text-sm">No notifications</p>
//               )}
//               {notifications.map((n) => (
//                 <div
//                   key={n.id}
//                   onClick={() => handleNotificationClick(n)}
//                   className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
//                     !n.is_read ? "font-semibold" : ""
//                   }`}
//                 >
//                   <p className="text-sm">
//                     {n.type === "new_assignment" && "📘 "}
//                     {n.type === "new_grade" && "📝 "}
//                     {n.type === "new_certificate" && "🎓 "}
//                     {n.type === "profile_update" && "👤 "}
//                     {n.type === "password_update" && "🔑 "}
//                     {n.message}
//                   </p>
//                   <span className="text-xs text-gray-400">
//                     {new Date(n.created_at).toLocaleString()}
//                   </span>
//                 </div>
//               ))}

//               {notifications.length > 0 && (
//                 <button
//                   onClick={async () => {
//                     await fetch("/api/student/notifications/clear", { method: "PUT" });
//                     setNotifications([]);
//                   }}
//                   className="text-blue-600 text-sm mt-2"
//                 >
//                   Clear all
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setShowDropdown(!showDropdown)}
//             className="flex items-center space-x-2"
//           >
//             <img
//               src={student?.image || "/default-avatar.png"}
//               alt="Profile"
//               className="w-10 h-10 rounded-full border"
//             />
//             <span>{student?.username || student?.full_name || "Student"}</span>
//           </button>

//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded z-50">
//               <ul>
//                 <li>
//                   <a
//                     href="/student-dashboard/profile"
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     Profile
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/student-dashboard/settings"
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     Settings
//                   </a>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => signOut({ callbackUrl: "/login" })}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// // app/components/layout/StudentHeader.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";

// interface Notification {
//   id: string;
//   type: string;
//   message: string;
//   is_read: boolean;
//   created_at: string;
// }

// interface StudentDTO {
//   id: string;
//   full_name: string;
//   email: string;
//   username?: string;
//   phone?: string | null;
//   image?: string | null;
// }

// export default function StudentHeader() {
//   const { data: session } = useSession();
//   const [student, setStudent] = useState<StudentDTO | null>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showNotif, setShowNotif] = useState(false);
//   const [seen, setSeen] = useState(false); // track bell clicked

//   // Load profile and notifications
//   async function loadData() {
//     try {
//       const [profileRes, notifRes] = await Promise.all([
//         fetch("/api/student/profile"),
//         fetch("/api/student/notifications"),
//       ]);

//       if (profileRes.ok) {
//         const json = await profileRes.json();
//         setStudent(json.user ?? null);
//       } else {
//         console.warn("Failed to fetch student profile", await profileRes.text());
//       }

//       if (notifRes.ok) {
//         const j = await notifRes.json();
//         setNotifications(j.notifications ?? []);
//       } else {
//         console.warn("Failed to fetch student notifications", await notifRes.text());
//       }
//     } catch (err) {
//       console.error("Error loading header:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Poll notifications every 10 seconds
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("/api/student/notifications");
//         if (res.ok) {
//           const j = await res.json();
//           setNotifications(j.notifications ?? []);
//         }
//       } catch (err) {
//         console.error("Polling notifications failed:", err);
//       }
//     }, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   // Listen for profile updates
//   useEffect(() => {
//     function handleProfileUpdate(e: CustomEvent) {
//       if (e.detail) {
//         setStudent((prev) => ({ ...prev, ...e.detail }));
//       }
//     }
//     window.addEventListener("profileUpdated", handleProfileUpdate as EventListener);
//     return () => {
//       window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener);
//     };
//   }, []);

//   if (loading) return <header className="p-4 bg-white shadow">Loading...</header>;

//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   // Clicking bell: mark all notifications as read
//   const handleBellClick = async () => {
//     setShowNotif(!showNotif);

//     if (!seen && unreadCount > 0) {
//       setSeen(true);

//       try {
//         const res = await fetch("/api/student/notifications/mark-all-read", {
//           method: "PUT",
//         });

//         if (!res.ok) console.error("Failed to mark notifications as read");

//         // Update local state
//         setNotifications((prev) =>
//           prev.map((n) => ({ ...n, is_read: true }))
//         );
//       } catch (err) {
//         console.error("Error marking notifications as read:", err);
//       }
//     }
//   };

//   // Handle clicking a notification (redirect only)
//   const handleNotificationClick = (notif: Notification) => {
//     let href = "#";
//     if (notif.type === "new_assignment") href = "/student-dashboard/assignments";
//     else if (notif.type === "new_grade") href = "/student-dashboard/grades";
//     else if (notif.type === "new_certificate") href = "/student-dashboard/certificates";
//     else if (notif.type === "profile_update") href = "/student-dashboard/profile";

//     window.location.href = href;
//   };

//   return (
//     <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
//       <div className="text-xl font-bold">Student Dashboard</div>

//       <div className="flex items-center space-x-4 relative">
//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={handleBellClick}
//             className="relative"
//             title="Notifications"
//           >
//             🔔
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {showNotif && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-2 z-50 max-h-80 overflow-y-auto">
//               {notifications.length === 0 && (
//                 <p className="text-gray-500 text-sm">No notifications</p>
//               )}
//               {notifications.map((n) => (
//                 <div
//                   key={n.id}
//                   onClick={() => handleNotificationClick(n)}
//                   className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
//                     !n.is_read ? "font-semibold" : ""
//                   }`}
//                 >
//                   <p className="text-sm">
//                     {n.type === "new_assignment" && "📘 "}
//                     {n.type === "new_grade" && "📝 "}
//                     {n.type === "new_certificate" && "🎓 "}
//                     {n.type === "profile_update" && "👤 "}
//                     {n.type === "password_update" && "🔑 "}
//                     {n.type === "assignment_sunmitted" && "📨  "}
//                     {n.message}
//                   </p>
//                   <span className="text-xs text-gray-400">
//                     {new Date(n.created_at).toLocaleString()}
//                   </span>
//                 </div>
//               ))}

//               {notifications.length > 0 && (
//                 <button
//                   onClick={async () => {
//                     await fetch("/api/student/notifications/clear", { method: "PUT" });
//                     setNotifications([]);
//                   }}
//                   className="text-blue-600 text-sm mt-2"
//                 >
//                   Clear all
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setShowDropdown(!showDropdown)}
//             className="flex items-center space-x-2"
//           >
//             <img
//               src={student?.image || "/default-avatar.png"}
//               alt="Profile"
//               className="w-10 h-10 rounded-full border"
//             />
//             <span>{student?.username || student?.full_name || "Student"}</span>
//           </button>

//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded z-50">
//               <ul>
//                 <li>
//                   <a
//                     href="/student-dashboard/profile"
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     Profile
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/student-dashboard/settings"
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     Settings
//                   </a>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => signOut({ callbackUrl: "/login" })}
//                     className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }





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
