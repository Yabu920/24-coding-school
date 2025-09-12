"use client"

import Link from "next/link"
import { Home, Users, BookOpen, FileText, Award } from "lucide-react"

interface Props {
  show: boolean
}

export default function Sidebar({ show }: Props) {
  if (!show) return null

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4">
      <nav className="space-y-2">
        <Link href="/teacher-dashboard" className="flex items-center gap-2 hover:text-blue-600">
          <Home size={18} /> Dashboard Overview
        </Link>
        <Link href="/teacher-dashboard/students" className="flex items-center gap-2 hover:text-blue-600">
          <Users size={18} /> View Students
        </Link>
        <Link href="/teacher-dashboard/assignments" className="flex items-center gap-2 hover:text-blue-600">
          <FileText size={18} /> Assignments
        </Link>
        <Link href="/teacher-dashboard/certificates" className="flex items-center gap-2 hover:text-blue-600">
          <Award size={18} /> Certificates
        </Link>
      </nav>
    </aside>
  )
}
