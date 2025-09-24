// // components/notification-dropdown.tsx
// "use client";
// import Link from "next/link";

// import { FC } from "react";

// export type NotificationItem = {
//   id: string;
//   type: "message" | "announcement" | "assignment";
//   title?: string;
//   content: string;
//   senderName?: string | null;
//   time: string; // ISO string
//   read?: boolean;
//   link?: string;

// };

// type Props = {
//   notifications: NotificationItem[];
//   loading?: boolean;
//   onMarkRead?: (id: string) => void;
//   onMarkAllRead?: () => void;
// };

// const NotificationDropdown: FC<Props> = ({
//   notifications,
//   loading = false,
//   onMarkRead,
//   onMarkAllRead,
// }) => {
//   const unreadCount = notifications.filter((n) => n.type === "message" && !n.read).length;

//  const handleMarkAllRead = async () => {
//     try {
//       await fetch("/api/student/notifications/mark-all-read", {
//         method: "POST",
//       });
//       if (onMarkAllRead) onMarkAllRead();
//     } catch (err) {
//       console.error("❌ Failed to mark notifications as read", err);
//     }
//   };

//   return (
//     <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 max-h-64 overflow-auto z-50">
//       <div className="flex items-center justify-between px-4 py-2 border-b">
//         <h4 className="font-semibold text-gray-700">Notifications</h4>
//         {unreadCount > 0 && (
//           <button
//             onClick={onMarkAllRead}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Mark all read
//           </button>
//         )}
//       </div>

//       <div className="max-h-64 overflow-auto">
//         {loading ? (
//           <div className="px-4 py-4 text-sm text-gray-500">Loading...</div>
//         ) : notifications.length === 0 ? (
//           <div className="px-4 py-4 text-sm text-gray-500">No notifications</div>
//         ) : (
//           <ul>
//             {notifications.map((note) => (
//               <li
//                 key={`${note.type}-${note.id}`}
//                 onClick={() => note.type === "message" && onMarkRead?.(note.id)}
//                 className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${
//                   note.type === "message" && !note.read ? "bg-gray-50" : ""
//                 }`}
//               >
//                 <div className="flex-1">
//                   <div className="flex justify-between">
//                     <div className="text-sm font-medium text-gray-800">
//                       {note.type === "message"
//                         ? note.senderName ?? "Message"
//                         : note.title ?? "Announcement"}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {new Date(note.time).toLocaleString()}
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600 mt-1">{note.content}</div>
//                 </div>
//                 {note.type === "message" && !note.read && (
//                   <div className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">New</div>
//                 )}
//               </li>
              

// // inside map
// /* <li
//   key={`${note.type}-${note.id}`}
//   className={`px-4 py-3 hover:bg-gray-50 flex items-start gap-3 ${
//     note.type === "message" && !note.read ? "bg-gray-50" : ""
//   }`}
// >
//   <div className="flex-1">
//     <Link
//       href={note.link ?? "#"}
//       onClick={async () => {
//         if (onMarkRead) {
//           onMarkRead(note.id);
//         }
//       }}
//       className="block w-full"
//     >
//       <div className="flex justify-between">
//         <div className="text-sm font-medium text-gray-800">
//           {note.type === "message"
//             ? note.senderName ?? "Message"
//             : note.title ?? "Announcement"}
//         </div>
//         <div className="text-xs text-gray-400">
//           {new Date(note.time).toLocaleString()}
//         </div>
//       </div>
//       <div className="text-sm text-gray-600 mt-1">{note.content}</div>
//     </Link>
//   </div>

//   {note.type === "message" && !note.read && (
//     <div className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">New</div>
//   )}
// </li> */

//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationDropdown;


// components/notification-dropdown.tsx
"use client";

import { FC } from "react";
import Link from "next/link";

export type NotificationItem = {
  id: string;
  type: "message" | "announcement" | "assignment"; // added assignment type
  title?: string;
  content: string;
  senderName?: string | null;
  time: string; // ISO string
  read?: boolean;
  link?: string | null; // added link field
};

type Props = {
  notifications: NotificationItem[];
  loading?: boolean;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
};

const NotificationDropdown: FC<Props> = ({
  notifications,
  loading = false,
  onMarkRead,
  onMarkAllRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/student/notifications/mark-all-read", {
        method: "POST",
      });
      if (onMarkAllRead) onMarkAllRead();
    } catch (err) {
      console.error("❌ Failed to mark notifications as read", err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 max-h-64 overflow-auto z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h4 className="font-semibold text-gray-700">Notifications</h4>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-64 overflow-auto">
        {loading ? (
          <div className="px-4 py-4 text-sm text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-4 text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          <ul>
            {notifications.map((note) => (
              <li
                key={`${note.type}-${note.id}`}
                className={`px-4 py-3 hover:bg-gray-50 flex items-start gap-3 ${
                  !note.read ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex-1">
                  {note.link ? (
                    <Link
                      href={note.link}
                      onClick={async () => {
                        // optional: mark single notification read
                        await fetch(
                          `/api/student/notifications/${note.id}/read`,
                          { method: "POST" }
                        );
                        if (onMarkRead) onMarkRead(note.id);
                      }}
                      className="block w-full"
                    >
                      <div className="flex justify-between">
                        <div className="text-sm font-medium text-gray-800">
                          {note.type === "message"
                            ? note.senderName ?? "Message"
                            : note.title ?? "Notification"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(note.time).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {note.content}
                      </div>
                    </Link>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <div className="text-sm font-medium text-gray-800">
                          {note.title ?? "Notification"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(note.time).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {note.content}
                      </div>
                    </>
                  )}
                </div>

                {!note.read && (
                  <div className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">
                    New
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
