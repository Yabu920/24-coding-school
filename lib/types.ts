// lib/types.ts
import type { Role } from "@prisma/client";

export type UserDTO = {
  id: string;
  role: Role;
  full_name: string;
  email: string;
  username?: string;
  phone?: string | null;
  profile_image_url?: string | null;
  status?: "active" | "inactive" | "banned";
};

export type TeacherDTO = UserDTO & {
  teacherId?: string; // teachers.id from teachers table
  experience_years?: number | null;
  subjects_taught?: string | null;
  bio?: string | null;
};

export type StudentDTO = {
  id: string; // students.id
  user_id: string;
  full_name: string;
  email: string;
  grade_level?: string | null;
  enrollment_date?: string;
  progress_score?: number;
};

export type CourseDTO = {
  id: string;
  name: string;
  description?: string | null;
  student_count?: number;
};
export type Submission = {
  id: string
  studentName: string
  submittedFile?: string | null
  description?: string | null
  submittedAt: Date | null
}

export type AssignmentDTO = {
  id: string;
  title: string;
  description?: string | null;
  file_url?: string | null;
  submissions?: Submission[];
  created_at?: string;
  due_date?: string | null;
  status?: "new"|"unsubmitted" | "submitted";
};
