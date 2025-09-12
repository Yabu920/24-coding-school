
// "use client";

// import { useEffect, useState } from "react";
// import { useSession, signOut } from "next-auth/react";

// export default function StudentHeader() {
//   const { data: session } = useSession();
//   const [user, setUser] = useState(session?.user);

//   useEffect(() => {
//     // Listen for profile updates
//     const handleUpdate = (e: any) => setUser(e.detail);
//     window.addEventListener("profileUpdated", handleUpdate);
//     return () => window.removeEventListener("profileUpdated", handleUpdate);
//   }, []);

//   return (
//     <header className="flex justify-between items-center p-4 bg-white shadow">
//       <h1 className="text-xl font-bold">Student Dashboard</h1>

//       <div className="flex items-center space-x-4 relative">
//         {/* Notification icon */}
//         <button className="relative">
//           <span className="material-icons text-gray-600">notifications</span>
//           <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         {/* Profile dropdown */}
//         <div className="relative">
//           <button className="flex items-center space-x-2">
//             <span>{user?.full_name}</span>
//             <img
//               src={user?.image || "/default-avatar.png"}
//               alt="Profile"
//               className="w-10 h-10 rounded-full"
//             />
//           </button>

//           <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg hidden group-hover:block z-50">
//             <ul className="flex flex-col p-2">
//               <li>
//                 <a href="/student-dashboard/profile" className="block px-2 py-1 hover:bg-gray-100 rounded">
//                   Profile
//                 </a>
//               </li>
//               <li>
//                 <a href="/student-dashboard/settings" className="block px-2 py-1 hover:bg-gray-100 rounded">
//                   Settings
//                 </a>
//               </li>
//               <li>
//                 <button
//                   onClick={() => signOut({ callbackUrl: "/login" })}
//                   className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
//                 >
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }



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

// export default function StudentHeader() {
//   const { data: session } = useSession();
//   const user = session?.user;

//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [profileImage, setProfileImage] = useState(user?.image || "/default-avatar.png");
//   const [username, setUsername] = useState(user?.username || "");

//   // Fetch notifications
//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const res = await fetch("/api/student/notifications");
//         const data = await res.json();
//         if (res.ok) setNotifications(data.notifications);
//       } catch (err) {
//         console.error("Failed to fetch notifications", err);
//       }
//     }

//     fetchNotifications();
//   }, []);

//   // Listen for profile updates
//   useEffect(() => {
//     const handleProfileUpdate = (e: Event) => {
//       const detail = (e as CustomEvent).detail;
//       setProfileImage(detail.image || "/default-avatar.png");
//       setUsername(detail.username || "");
//     };
//     window.addEventListener("profileUpdated", handleProfileUpdate);
//     return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
//   }, []);

//   const unreadCount = notifications.filter(n => !n.is_read).length;

//   return (
//     <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
//       <div className="text-xl font-bold">Student Dashboard</div>

//       <div className="flex items-center space-x-4 relative">
//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => setNotifOpen(!notifOpen)}
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

//           {notifOpen && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-2 z-50 max-h-80 overflow-y-auto">
//               {notifications.length === 0 && <p className="text-gray-500 text-sm">No notifications</p>}
//               {notifications.map((n) => (
//                 <div key={n.id} className={`p-2 rounded hover:bg-gray-100 ${!n.is_read ? "font-semibold" : ""}`}>
//                   <p className="text-sm">{n.message}</p>
//                   <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             className="flex items-center space-x-2"
//           >
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-10 h-10 rounded-full border"
//             />
//             <span>{username}</span>
//           </button>

//           {dropdownOpen && (
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

// components/layout/StudentHeader.tsx

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

// export default function StudentHeader() {
//   const { data: session } = useSession();
//   const user = session?.user;

//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [profileImage, setProfileImage] = useState(user?.image || "/default-avatar.png");
//   const [username, setUsername] = useState(user?.username || "");

//   // Update profile info reactively if session changes
//   useEffect(() => {
//     if (user) {
//       setProfileImage(user.image || "/default-avatar.png");
//       setUsername(user.username || "");
//     }
//   }, [user]);

//   // Fetch notifications
//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const res = await fetch("/api/student/notifications");
//         const data = await res.json();
//         if (res.ok) setNotifications(data.notifications);
//       } catch (err) {
//         console.error("Failed to fetch notifications", err);
//       }
//     }
//     fetchNotifications();
//   }, []);

//   const unreadCount = notifications.filter(n => !n.is_read).length;

//   return (
//     <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
//       <div className="text-xl font-bold">Student Dashboard</div>

//       <div className="flex items-center space-x-4 relative">
//         {/* Notifications */}
//         <div className="relative">
//           <button onClick={() => setNotifOpen(!notifOpen)} className="relative" title="Notifications">
//             🔔
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {notifOpen && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-2 z-50 max-h-80 overflow-y-auto">
//               {notifications.length === 0 && <p className="text-gray-500 text-sm">No notifications</p>}
//               {notifications.map((n) => (
//                 <div key={n.id} className={`p-2 rounded hover:bg-gray-100 ${!n.is_read ? "font-semibold" : ""}`}>
//                   <p className="text-sm">{n.message}</p>
//                   <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
//             <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full border" />
//             <span>{username}</span>
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded z-50">
//               <ul>
//                 <li>
//                   <a href="/student-dashboard/profile" className="block px-4 py-2 hover:bg-gray-100">
//                     Profile
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/student-dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">
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

// export default function StudentHeader() {
//   const { data: session } = useSession();
//   const user = session?.user;

//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [profileImage, setProfileImage] = useState("/default-avatar.png");
//   const [username, setUsername] = useState("");

//   // Set initial user info and update reactively
//   useEffect(() => {
//     if (user) {
//       setProfileImage(user.image || "/default-avatar.png");
//       setUsername(user.username || "");
//     }
//   }, [user]);

//   // Listen for profile update events
//   useEffect(() => {
//     const handler = (e: any) => {
//       setProfileImage(e.detail.image || "/default-avatar.png");
//       setUsername(e.detail.username || "");
//     };
//     window.addEventListener("profileUpdated", handler);
//     return () => window.removeEventListener("profileUpdated", handler);
//   }, []);

//   // Fetch notifications
//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const res = await fetch("/api/student/notifications");
//         const data = await res.json();
//         if (res.ok) setNotifications(data.notifications);
//       } catch (err) {
//         console.error("Failed to fetch notifications", err);
//       }
//     }
//     fetchNotifications();
//   }, []);

//   const unreadCount = notifications.filter(n => !n.is_read).length;

//   return (
//     <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
//       <div className="text-xl font-bold">Student Dashboard</div>

//       <div className="flex items-center space-x-4 relative">
//         {/* Notifications */}
//         <div className="relative">
//           <button onClick={() => setNotifOpen(!notifOpen)} className="relative" title="Notifications">
//             🔔
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
//                 {unreadCount}
//               </span>
//             )}
//           </button>

//           {notifOpen && (
//             <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded p-2 z-50 max-h-80 overflow-y-auto">
//               {notifications.length === 0 && <p className="text-gray-500 text-sm">No notifications</p>}
//               {notifications.map((n) => (
//                 <div key={n.id} className={`p-2 rounded hover:bg-gray-100 ${!n.is_read ? "font-semibold" : ""}`}>
//                   <p className="text-sm">{n.message}</p>
//                   <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
//             <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full border" />
//             <span>{username}</span>
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded z-50">
//               <ul>
//                 <li>
//                   <a href="/student-dashboard/profile" className="block px-4 py-2 hover:bg-gray-100">
//                     Profile
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/student-dashboard/settings" className="block px-4 py-2 hover:bg-gray-100">
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
                <div
                  key={n.id}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    !n.is_read ? "font-semibold" : ""
                  }`}
                >
                  <p className="text-sm">{n.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
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
