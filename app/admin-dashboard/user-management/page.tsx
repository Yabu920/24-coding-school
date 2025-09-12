//app/admin-dashboard/user-management/page.tsx
"use client"

import { useEffect, useState } from "react"
import AdminLayout from "../layout"

type User = {
  id: string
  full_name: string
  email: string
  phone?: string
  role: "student" | "teacher" | "admin"
  status: "active" | "inactive" | "banned"
  teacher?: {
    experience_years?: number
    subjects_taught?: string
  }
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 15

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    status: "active",
    experience_years: "",
    subjects_taught: "",
  })
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users")
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setUsers(data.users)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setEditForm({
      full_name: user.full_name,
      phone: user.phone || "",
      status: user.status,
      experience_years: user.teacher?.experience_years?.toString() || "",
      subjects_taught: user.teacher?.subjects_taught || "",
    })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    if (!editingUser) return
    setEditLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update user")
      setUsers((prev) =>
        prev.map((u) => (u.id === data.user.id ? data.user : u))
      )
      alert("User updated successfully")
      setEditingUser(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete user")
      setUsers((prev) => prev.filter((u) => u.id !== id))
      alert("User deleted successfully")
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>

        {/* ✅ Summary Counter */}
         {/* Summary Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold text-blue-700">{users.length}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Admins</h3>
            <p className="text-2xl font-bold text-green-700">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Teachers</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {users.filter((u) => u.role === "teacher").length}
            </p>
          </div>
          <div className="p-4 bg-purple-100 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold">Students</h3>
            <p className="text-2xl font-bold text-purple-700">
              {users.filter((u) => u.role === "student").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Users Table */}
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{startIndex + index + 1}</td>
                    <td className="px-4 py-2">{user.full_name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phone || "-"}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "inactive"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === page ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit User</h3>
              <input
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditChange}
                placeholder="Full Name"
                className="w-full mb-2 px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                placeholder="Phone"
                className="w-full mb-2 px-4 py-2 border rounded"
              />
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full mb-2 px-4 py-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>

              {editingUser.role === "teacher" && (
                <>
                  <input
                    type="number"
                    name="experience_years"
                    value={editForm.experience_years}
                    onChange={handleEditChange}
                    placeholder="Experience Years"
                    className="w-full mb-2 px-4 py-2 border rounded"
                  />
                  <input
                    type="text"
                    name="subjects_taught"
                    value={editForm.subjects_taught}
                    onChange={handleEditChange}
                    placeholder="Subjects Taught"
                    className="w-full mb-2 px-4 py-2 border rounded"
                  />
                </>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={editLoading}
                >
                  {editLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
}

