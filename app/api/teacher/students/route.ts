// app/api/teacher/students/route.ts
// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// export async function GET() {
//   const session = await getServerSession(authOptions)
//   if (!session || session.user.role !== "teacher") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const teacherId = session.user.id

//   // 1. Find teacher record (link teacher -> user_id)
//   const teacher = await prisma.teachers.findUnique({
//     where: { user_id: teacherId },
//   })

//   if (!teacher) {
//     return NextResponse.json({ students: [] })
//   }

//   // 2. Find all student enrollments in courses taught by this teacher
//   const studentCourses = await prisma.student_courses.findMany({
//     where: {
//       course: {
//         teacher_courses: {
//           some: { teacher_id: teacher.id },
//         },
//       },
//     },
//     include: {
//       student: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   })

//   // 3. Map + deduplicate students
//   const students = studentCourses.map(sc => ({
//     id: sc.student.id,
//     full_name: sc.student.user.full_name,
//     email: sc.student.user.email,
//   }))

//   const uniqueStudents = Array.from(new Map(students.map(s => [s.id, s])).values())

//   return NextResponse.json({ students: uniqueStudents })
// }


// app/api/teacher/students/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const teacherId = session.user.id

  // 1. Get teacher record
  const teacher = await prisma.teachers.findUnique({
    where: { user_id: teacherId },
  })

  if (!teacher) {
    return NextResponse.json({ students: [] })
  }

  // 2. Get students enrolled in teacher’s courses
  const studentCourses = await prisma.student_courses.findMany({
    where: {
      course: {
        teacher_courses: {
          some: { teacher_id: teacher.id },
        },
      },
    },
    include: {
      student: {
        include: {
          user: true,
          student_courses: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  })

  // 3. Transform data for frontend
  const students = studentCourses.map(sc => {
    const s = sc.student
    return {
      id: s.id,
      full_name: s.user.full_name,
      email: s.user.email,
      phone: s.user.phone,
      grade_level: s.grade_level,
      enrollment_date: s.enrollment_date.toISOString(),
      progress_score: s.progress_score,
      courses: s.student_courses.map(sc2 => ({
        id: sc2.course.id,
        name: sc2.course.name,
      })),
    }
  })

  // Deduplicate students
  const uniqueStudents = Array.from(new Map(students.map(s => [s.id, s])).values())

  return NextResponse.json({ students: uniqueStudents })
}

