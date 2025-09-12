
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin-dashboard/user-management", icon: Users },
  { name: "User Registration", href: "/admin-dashboard/register-user", icon: UserPlus },
  { name: "Class / Course", href: "/admin-dashboard/courses", icon: BookOpen },
  { name: "Assignments", href: "/admin-dashboard/assignments", icon: FileText },
  { name: "Messages", href: "/admin-dashboard/messages", icon: MessageSquare },
  { name: "Reports / Progress", href: "/admin-dashboard/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin-dashboard/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 h-screen shadow-xl">
      <div className="p-6 text-2xl font-bold text-white border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200 
                ${isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
