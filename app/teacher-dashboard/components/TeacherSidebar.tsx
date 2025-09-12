
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid, Users, BookOpen, FileText, Award } from "lucide-react";

const items = [
  { name: "Overview", href: "/teacher-dashboard", icon: Grid },
  { name: "Students", href: "/teacher-dashboard/students", icon: Users },
  { name: "Courses", href: "/teacher-dashboard/courses", icon: BookOpen },
  { name: "Assignments", href: "/teacher-dashboard/assignments", icon: FileText },
  { name: "Certificates", href: "/teacher-dashboard/certificates", icon: Award },
];

export default function TeacherSidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="p-4 font-bold">Teacher Panel</div>
      <nav className="p-3 space-y-1">
        {items.map((it) => {
          const active = path === it.href || path?.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex items-center gap-3 p-2 rounded hover:bg-gray-50 ${
                active ? "bg-blue-50 text-blue-700 font-semibold" : ""
              }`}
            >
              <it.icon className="w-4 h-4" />
              {it.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Grid, Users, BookOpen, FileText, Award, ChevronDown } from "lucide-react";
// import { useState } from "react";

// const items = [
//   { name: "Overview", href: "/teacher-dashboard", icon: Grid },
//   { name: "Students", href: "/teacher-dashboard/students", icon: Users },
//   { name: "Courses", href: "/teacher-dashboard/courses", icon: BookOpen },
//   {
//     name: "Assignments",
//     href: "/teacher-dashboard/assignments",
//     icon: FileText,
//     submenu: [
//       { name: "All Assignments", href: "/teacher-dashboard/assignments" },
//       { name: "Submitted Assignments", href: "/teacher-dashboard/assignments/submitted" },
//     ],
//   },
//   { name: "Certificates", href: "/teacher-dashboard/certificates", icon: Award },
// ];

// export default function TeacherSidebar() {
//   const path = usePathname();
//   const [openMenu, setOpenMenu] = useState<string | null>(null);

//   return (
//     <aside className="w-64 bg-white border-r min-h-screen">
//       <div className="p-4 font-bold">Teacher Panel</div>
//       <nav className="p-3 space-y-1">
//         {items.map((it) => {
//           const isActive = path === it.href || path?.startsWith(it.href + "/");
//           const hasSubmenu = !!it.submenu;

//           return (
//             <div key={it.href}>
//               <div
//                 className={`flex items-center justify-between gap-3 p-2 rounded hover:bg-gray-50 ${
//                   isActive ? "bg-blue-50 text-blue-700 font-semibold" : ""
//                 }`}
//                 onClick={() => hasSubmenu && setOpenMenu(openMenu === it.name ? null : it.name)}
//               >
//                 <div className="flex items-center gap-3">
//                   <it.icon className="w-4 h-4" />
//                   {it.name}
//                 </div>
//                 {hasSubmenu && <ChevronDown className={`w-4 h-4 transition-transform ${openMenu === it.name ? "rotate-180" : ""}`} />}
//               </div>

//               {hasSubmenu && openMenu === it.name && (
//                 <div className="ml-6 flex flex-col space-y-1">
//                   {it.submenu!.map((sub) => {
//                     const subActive = path === sub.href;
//                     return (
//                       <Link
//                         key={sub.href}
//                         href={sub.href}
//                         className={`p-2 rounded hover:bg-gray-50 ${subActive ? "bg-blue-50 text-blue-700 font-semibold" : ""}`}
//                       >
//                         {sub.name}
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }
