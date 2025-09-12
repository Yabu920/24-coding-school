// User roles
export type Role = "admin" | "teacher" | "student"

// Student type
export interface Student {
  id: string
  full_name: string
  email: string
  username?: string
  phone?: string
  grade_level?: string
  enrollment_date: string
  progress_score: number
  courseName?: string
}

// Assignment type
export interface Assignment {
  id: string
  title: string
  description?: string
  file_url?: string
  created_at: string
  assigned_to: Student[]
}

// Course type
export interface Course {
  id: string
  name: string
  description?: string
  students: Student[]
}

// Certificate type
export interface Certificate {
  id: string
  studentId: string
  courseId: string
  issued_at: string
  file_url: string
}
