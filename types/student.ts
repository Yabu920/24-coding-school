// types/student.ts
import type { Role } from "@prisma/client";

export type UserSession = {
  id: string;
  role: Role;
  full_name: string;
  email: string;
  image?: string | null;
};

export type StudentOverview = {
  enrolledCourses: {
    id: string;
    name: string;
    description?: string | null;
    progress_score?: number | null;
    teacherNames?: string[]; // optional
  }[];
  upcomingAssignments: {
    id: string;
    title: string;
    due_date?: string | null;
    courseId: string;
    courseName: string;
    status: "pending" | "submitted" | "graded";
    grade?: string | null;
  }[];
  certificatesIssued: {
    id: string;
    courseName: string;
    issued_at: string;
    file_url?: string;
  }[];
};
