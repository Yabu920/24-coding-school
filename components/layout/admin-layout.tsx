"use client"

import { ReactNode } from "react"
import AdminSidebar from "@/components/AdminSidebar"
import AdminHeader from "@/components/layout/admin-header"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar (fixed left) */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Global header (appears once for all pages) */}
        <AdminHeader />

        

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}




// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { FiHome, FiUsers, FiEdit, FiBookOpen, FiClipboard, FiMessageCircle, FiBarChart2, FiSettings, FiMenu, FiBell, FiUser } from "react-icons/fi"

// interface SidebarItem {
//   label: string
//   icon: JSX.Element
//   href: string
//   badge?: number
// }

// const sidebarItems: SidebarItem[] = [
//   { label: "Dashboard", icon: <FiHome />, href: "/admin-dashboard" },
//   { label: "User Management", icon: <FiUsers />, href: "/admin-dashboard/users" },
//   { label: "Register User", icon: <FiEdit />, href: "/admin-dashboard/register" },
//   { label: "Classes / Courses", icon: <FiBookOpen />, href: "/admin-dashboard/classes", badge: 2 },
//   { label: "Assignments", icon: <FiClipboard />, href: "/admin-dashboard/assignments", badge: 3 },
//   { label: "Messages", icon: <FiMessageCircle />, href: "/admin-dashboard/messages", badge: 4 },
//   { label: "Reports / Progress", icon: <FiBarChart2 />, href: "/admin-dashboard/reports" },
//   { label: "Settings", icon: <FiSettings />, href: "/admin-dashboard/settings" },
// ]

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-blue-700 shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
//         <div className="flex items-center justify-center h-16 border-b bg-gray-50">
//           <h1 className="text-xl font-bold text-blue-700 ">Coding School</h1>
//         </div>
//         <nav className="p-4 space-y-1">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.label}
//               href={item.href}
//               className={`flex items-center justify-between p-2 rounded-lg hover:bg-blue-100 transition-colors ${pathname === item.href ? "bg-blue-100 font-semibold" : ""}`}
//             >
//               <div className="flex items-center gap-3">
//                 {item.icon}
//                 <span>{item.label}</span>
//               </div>
//               {item.badge && (
//                 <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{item.badge}</span>
//               )}
//             </Link>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col md:ml-64">
//         {/* Header */}
//         <header className="flex items-center justify-between h-16 px-4 bg-white shadow-md">
//           <div className="flex items-center gap-4 md:hidden">
//             <button onClick={() => setSidebarOpen(!sidebarOpen)}>
//               <FiMenu size={24} />
//             </button>
//             <h1 className="text-lg font-bold">Coding School</h1>
//           </div>
//           <div className="flex items-center gap-4 ml-auto">
//             <button className="relative">
//               <FiBell size={24} />
//               <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">3</span>
//             </button>
//             <div className="relative">
//               <button className="flex items-center gap-2 border rounded-full px-2 py-1 hover:bg-gray-100">
//                 <FiUser size={20} />
//                 <span>Admin</span>
//               </button>
//               {/* Dropdown can be implemented later */}
//             </div>
//           </div>
//         </header>

//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   )
// }




// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { FiHome, FiUsers, FiEdit, FiBookOpen, FiClipboard, FiMessageCircle, FiBarChart2, FiSettings, FiMenu, FiBell, FiUser } from "react-icons/fi"

// interface SidebarItem {
//   label: string
//   icon: JSX.Element
//   href: string
//   badge?: number
//   children?: SidebarItem[]
// }

// const sidebarItems: SidebarItem[] = [
//   { label: "Dashboard", icon: <FiHome />, href: "/admin-dashboard" },
//   { label: "User Management", icon: <FiUsers />, href: "/admin-dashboard/users" },
//   { label: "Register User", icon: <FiEdit />, href: "/admin-dashboard/register" },
//   { label: "Classes / Courses", icon: <FiBookOpen />, href: "/admin-dashboard/classes", badge: 2 },
//   { label: "Assignments", icon: <FiClipboard />, href: "/admin-dashboard/assignments", badge: 3 },
//   { label: "Messages", icon: <FiMessageCircle />, href: "/admin-dashboard/messages", badge: 4 },
//   { label: "Reports / Progress", icon: <FiBarChart2 />, href: "/admin-dashboard/reports" },
//   { label: "Settings", icon: <FiSettings />, href: "/admin-dashboard/settings" },
// ]

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-blue shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
//         <div className="flex items-center justify-center h-16 border-b">
//           <h1 className="text-xl font-bold text-blue-700">Coding School</h1>
//         </div>
//         <nav className="p-4 space-y-1">
//           {sidebarItems.map((item) => (
//             <Link
//               key={item.label}
//               href={item.href}
//               className={`flex items-center justify-between p-2 rounded-lg hover:bg-blue-100 transition-colors ${pathname === item.href ? "bg-blue-100 font-semibold" : ""}`}
//             >
//               <div className="flex items-center gap-3">
//                 {item.icon}
//                 <span>{item.label}</span>
//               </div>
//               {item.badge && (
//                 <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{item.badge}</span>
//               )}
//             </Link>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col md:ml-64">
//         {/* Header */}
//         <header className="flex items-center justify-between h-16 px-4 bg-white shadow-md">
//           <div className="flex items-center gap-4 md:hidden">
//             <button onClick={() => setSidebarOpen(!sidebarOpen)}>
//               <FiMenu size={24} />
//             </button>
//             <h1 className="text-lg font-bold">Coding School</h1>
//           </div>
//           <div className="flex items-center gap-4 ml-auto">
//             <button className="relative">
//               <FiBell size={24} />
//               <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">3</span>
//             </button>
//             <div className="relative">
//               <button className="flex items-center gap-2 border rounded-full px-2 py-1 hover:bg-gray-100">
//                 <FiUser size={20} />
//                 <span>Admin</span>
//               </button>
//               {/* Dropdown example (can implement later) */}
//             </div>
//           </div>
//         </header>

//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   )
// }
