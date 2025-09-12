
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/student-dashboard" },
    { name: "Courses", href: "/student-dashboard/courses" },
    { name: "Assignments", href: "/student-dashboard/assignments" },
    { name: "Certificates", href: "/student-dashboard/certificates" },
    { name: "Profile", href: "/student-dashboard/profile" },
  ];

  return (

    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
              pathname === link.href ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
