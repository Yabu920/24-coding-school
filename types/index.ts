// // User roles
// export type Role = "admin" | "teacher" | "student"

// // Student type
// export interface Student {
//   id: string
//   full_name: string
//   email: string
//   username?: string
//   phone?: string
//   grade_level?: string
//   enrollment_date: string
//   progress_score: number
//   courseName?: string
// }


// // Assignment type
// export interface Assignment {
//   id: string
//   title: string
//   description?: string
//   file_url?: string
//   created_at: string
//   assigned_to: Student[]
//   due_date?: string
// }

// // Course type
// export interface Course {
//   id: string
//   name: string
//   description?: string
//   students: Student[]
// }

// // Certificate type
// export interface Certificate {
//   id: string
//   studentId: string
//   courseId?: "c1"
//   issued_at: string
//   file_url: string
//   courseName?: string
// }



// types/index.ts

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

// Submission type
export interface Submission {
  id: string
  description?: string | null
  submittedFile?: string | null
  submittedAt?: string | null
  studentName: string
  studentId: string
}



// Assignment type
export interface Assignment {
  id: string
  title: string
  description?: string
  file_url?: string
  created_at: string
  assigned_to: Student[]
  due_date?: string
  submissions?: Submission[] // ✅ added this
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
  courseId?: "c1"
  issued_at: string
  file_url: string
  courseName?: string
}
