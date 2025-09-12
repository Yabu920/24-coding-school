"use client"

import { useState } from "react"
import { FiUsers, FiUserCheck, FiBookOpen, FiUser } from "react-icons/fi"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Legend
} from "recharts"

interface AdminPortalProps {
  stats: {
    totalStudents: number
    activeStudents: number
    totalTeachers: number
    totalCourses: number
  }
  studentLevels: {
    grade_level: string | null
    _count: { grade_level: number }
  }[]
  registrations: { created_at: Date }[]
}

export default function AdminPortal({ stats, studentLevels, registrations }: AdminPortalProps) {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Mock courses data for chart demonstration
  const courses = [
    { id: 1, title: "Math 101" },
    { id: 2, title: "Physics 101" },
    { id: 3, title: "Chemistry 101" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 bg-gray-50">
        {activeSection === "dashboard" && (
          <DashboardOverview
            stats={stats}
            studentLevels={studentLevels}
            registrations={registrations}
            courses={courses}
          />
        )}
        {activeSection === "users" && <UserManagement registrations={registrations} />}
        {activeSection === "classes" && <ClassesSection />}
        {activeSection === "assignments" && <AssignmentsSection />}
        {activeSection === "progress" && <ProgressSection />}
        {activeSection === "messages" && <MessagesSection />}
      </main>
    </div>
  )
}

/* ---------------- Dashboard Overview ---------------- */
function DashboardOverview({
  stats,
  studentLevels,
  registrations,
  courses
}: {
  stats: AdminPortalProps["stats"]
  studentLevels: AdminPortalProps["studentLevels"]
  registrations: AdminPortalProps["registrations"]
  courses: any[]
}) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const studentLevelData = studentLevels.map(sl => ({
    level: sl.grade_level || "Unknown",
    count: sl._count.grade_level
  }))

  const userTypeData = [
    { name: "Students", value: stats.totalStudents },
    { name: "Teachers", value: stats.totalTeachers },
  ]

  const newRegistrations = registrations.map((r, idx) => ({
    month: r.created_at.toLocaleString("default", { month: "short" }),
    students: 1, // you can aggregate counts per month if needed
  }))

  const statsCards = [
    { label: "Total Students", value: stats.totalStudents, icon: <FiUsers size={24} className="text-blue-500" /> },
    { label: "Active Students", value: stats.activeStudents, icon: <FiUserCheck size={24} className="text-green-500" /> },
    { label: "Total Teachers", value: stats.totalTeachers, icon: <FiUser size={24} className="text-yellow-500" /> },
    { label: "Total Courses", value: stats.totalCourses, icon: <FiBookOpen size={24} className="text-purple-500" /> },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome, Admin</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <div>{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{stat.value}</h3>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Levels */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Students by Level</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={studentLevelData}>
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Type Pie */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Users Ratio</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {userTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* New Registrations */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h3 className="font-semibold mb-2">New Registrations (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={newRegistrations}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Other Sections ---------------- */
function UserManagement({ registrations }: { registrations: AdminPortalProps["registrations"] }) {
  return <div>User Management Section will go here.</div>
}

function ClassesSection() { return <div> Class management features will go here.</div> }
function AssignmentsSection() { return <div> Assignments management will go here.</div> }
function ProgressSection() { return <div> Student progress tracking will go here.</div> }
function MessagesSection() { return <div> Messaging system will go here.</div> }




// "use client"

// import { useState } from "react"
// import { FiUsers, FiUserCheck, FiBookOpen, FiUser } from "react-icons/fi"
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Legend
// } from "recharts"

// export default function AdminPortal({ initialUsers }: { initialUsers: any[] }) {
//   const [activeSection, setActiveSection] = useState("dashboard")

//   // Mock courses data for chart demonstration
//   const courses = [
//     { id: 1, title: "Math 101" },
//     { id: 2, title: "Physics 101" },
//     { id: 3, title: "Chemistry 101" },
//   ]

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-50">
//         {activeSection === "dashboard" && (
//           <DashboardOverview users={initialUsers} courses={courses} />
//         )}
//         {activeSection === "users" && <UserManagement initialUsers={initialUsers} />}
//         {activeSection === "classes" && <ClassesSection />}
//         {activeSection === "assignments" && <AssignmentsSection />}
//         {activeSection === "progress" && <ProgressSection />}
//         {activeSection === "messages" && <MessagesSection />}
//       </main>
//     </div>
//   )
// }

// /* ---------------- Dashboard Overview ---------------- */
// function DashboardOverview({ users, courses }: { users: any[]; courses: any[] }) {
//   const totalStudents = users.filter(u => u.role === "student").length
//   const activeStudents = users.filter(u => u.role === "student" && u.active).length
//   const totalTeachers = users.filter(u => u.role === "teacher").length
//   const totalCourses = courses.length

//   const stats = [
//     { label: "Total Students", value: totalStudents, icon: <FiUsers size={24} className="text-blue-500" /> },
//     { label: "Active Students", value: activeStudents, icon: <FiUserCheck size={24} className="text-green-500" /> },
//     { label: "Total Teachers", value: totalTeachers, icon: <FiUser size={24} className="text-yellow-500" /> },
//     { label: "Total Courses", value: totalCourses, icon: <FiBookOpen size={24} className="text-purple-500" /> },
//   ]

//   const studentLevelData = [
//     { level: "Beginner", count: users.filter(u => u.role === "student" && u.level === "beginner").length },
//     { level: "Intermediate", count: users.filter(u => u.role === "student" && u.level === "intermediate").length },
//     { level: "Advanced", count: users.filter(u => u.role === "student" && u.level === "advanced").length },
//   ]

//   const userTypeData = [
//     { name: "Students", value: totalStudents },
//     { name: "Teachers", value: totalTeachers },
//   ]

//   const COLORS = ["#0088FE", "#00C49F"]

//   const newRegistrations = [
//     { month: "Jan", students: 5, teachers: 2 },
//     { month: "Feb", students: 8, teachers: 1 },
//     { month: "Mar", students: 3, teachers: 0 },
//     { month: "Apr", students: 7, teachers: 1 },
//   ]


//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">Welcome, Admin</h2>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map(stat => (
//           <div key={stat.label} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
//             <div>{stat.icon}</div>
//             <div>
//               <h3 className="text-lg font-semibold">{stat.value}</h3>
//               <p className="text-gray-500">{stat.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Student Levels */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="font-semibold mb-2">Students by Level</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={studentLevelData}>
//               <XAxis dataKey="level" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="count" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* User Type Pie */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h3 className="font-semibold mb-2">Users Ratio</h3>
//           <ResponsiveContainer width="100%" height={250}>
//             <PieChart>
//               <Pie
//                 data={userTypeData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 {userTypeData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* New Registrations */}
//         <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
//           <h3 className="font-semibold mb-2">New Registrations (Monthly)</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={newRegistrations}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="students" stroke="#8884d8" />
//               <Line type="monotone" dataKey="teachers" stroke="#82ca9d" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ---------------- Other Sections ---------------- */
// function UserManagement({ initialUsers }: { initialUsers: any[] }) {
//   return <div>User Management Section will go here.</div>
// }

// function ClassesSection() { return <div> Class management features will go here.</div> }
// function AssignmentsSection() { return <div> Assignments management will go here.</div> }
// function ProgressSection() { return <div> Student progress tracking will go here.</div> }
// function MessagesSection() { return <div> Messaging system will go here.</div> }
