"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"

export default function RegisterUserForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
    grade_level: "",
    experience_years: "",
    bio: "",
    subjects_taught: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/admin/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("User registered successfully!")
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          password: "",
          role: "student",
          grade_level: "",
          experience_years: "",
          bio: "",
          subjects_taught: "",
        })
      } else {
        toast.error(data.error || "Failed to register user")
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Register User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone (optional)"
          className="w-full p-2 border rounded"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select name="role" className="w-full p-2 border rounded" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {formData.role === "student" && (
          <input
            name="grade_level"
            placeholder="Grade Level"
            className="w-full p-2 border rounded"
            value={formData.grade_level}
            onChange={handleChange}
          />
        )}

        {formData.role === "teacher" && (
          <>
            <input
              name="experience_years"
              type="number"
              placeholder="Experience (Years)"
              className="w-full p-2 border rounded"
              value={formData.experience_years}
              onChange={handleChange}
            />
            <textarea
              name="bio"
              placeholder="Short Bio"
              className="w-full p-2 border rounded"
              value={formData.bio}
              onChange={handleChange}
            />
            <input
              name="subjects_taught"
              placeholder="Subjects Taught"
              className="w-full p-2 border rounded"
              value={formData.subjects_taught}
              onChange={handleChange}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register User"}
        </button>
      </form>
    </div>
  )
}
