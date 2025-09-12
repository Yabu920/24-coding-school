import { teachers } from "@prisma/client"

export type TeacherWithRelations = teachers & {
  user: {
    full_name: string
    profile_image_url?: string | null
  }
  live_classes: {
    id: string
    title: string
    start_time: Date
    description: string | null
  }[]
  teacher_courses?: {
    id: string
    course: {
      id: string
      name: string
      description: string | null
      student_courses?: {
        id: string
        student: {
          user: {
            full_name: string
            email: string
          }
        }
      }[]
    }
  }[]
  assignments?: {
    id: string
    title: string
    description: string | null
    
    due_date: Date | null
  }[]
}
