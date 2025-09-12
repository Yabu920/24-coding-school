"use client"

import { useState } from "react"
import { FiUsers, FiUserCheck, FiBookOpen, FiUser, FiHome, FiMessageCircle } from "react-icons/fi"

export default function Sidebar() {
  const [active, setActive] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { id: "users", label: "Users", icon: <FiUsers /> },
    { id: "classes", label: "Classes", icon: <FiBookOpen /> },
    { id: "assignments", label: "Assignments", icon: <FiUserCheck /> },
    { id: "progress", label: "Progress", icon: <FiUser /> },
    { id: "messages", label: "Messages", icon: <FiMessageCircle /> },
  ]

  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 p-2 mb-2 rounded hover:bg-gray-100 w-full text-left ${
              active === item.id ? "bg-gray-200 font-semibold" : ""
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 w-full text-left">
          Logout
        </button>
      </div>
    </aside>
  )
}
