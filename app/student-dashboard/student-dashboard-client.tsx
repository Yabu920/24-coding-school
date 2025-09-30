// app/student-dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"


type Stats = {
  courses: number
  assignments: number
  certificates: number
  recentGrade?: { course: string; grade: string; feedback?: string }
}

type AssignmentStatus = { name: string; value: number }
type GradeData = { course: string; grade: number }

export default function StudentDashboardPage() {

  const [stats, setStats] = useState<Stats>({ courses: 0, assignments: 0, certificates: 0 })
  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus[]>([])
  const [gradeData, setGradeData] = useState<GradeData[]>([])

   

  


  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/student/dashboard")
      const data = await res.json()
      setStats(data.stats)
      setAssignmentStatus(data.assignmentStatus)
      setGradeData(data.gradeData)
    }
    fetchData()
  }, [])

  const COLORS = ["#4CAF50", "#FF9800", "#F44336"]

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Student Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Enrolled Courses</h3>
          <p className="text-2xl font-bold">{stats.courses}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Upcoming Assignments</h3>
          <p className="text-2xl font-bold">{stats.assignments}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Certificates</h3>
          <p className="text-2xl font-bold">{stats.certificates}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-500">Recent Grade</h3>
          <p className="text-lg font-bold">{stats.recentGrade?.grade || "-"}</p>
          <p className="text-xs text-gray-500">{stats.recentGrade?.feedback || "No feedback"}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Assignment Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={assignmentStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                {assignmentStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Grades by Course</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="grade" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}