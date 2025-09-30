// // app/api/admin/courses/[id]/enroll-student/route.ts
// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getSession } from "@/lib/auth"
// import { Role } from "@prisma/client"

// type Params = { params: { id: string } }

// /**
//  * POST /api/admin/courses/[id]/enroll-student
//  * Body: { studentId: string }
//  * Creates a row in student_courses (unique by student_id+course_id)
//  */
// export async function POST(req: Request, { params }: Params) {
//   const session = await getSession()
//   if (!session || session.role !== Role.admin) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const { studentId } = (await req.json()) as { studentId?: string }
//     if (!studentId) {
//       return NextResponse.json({ error: "studentId is required" }, { status: 400 })
//     }

//     // Ensure both exist
//     const [student, course] = await Promise.all([
//       prisma.students.findUnique({ where: { id: studentId } }),
//       prisma.courses.findUnique({ where: { id: params.id } }),
//     ])
//     if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })
//     if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

//     // Create link (unique constraint protects duplicates)
//     const link = await prisma.student_courses.create({
//       data: { student_id: studentId, course_id: params.id },
//     })

//     return NextResponse.json({ success: true, link })
//   } catch (err: any) {
//     if (String(err?.code) === "P2002") {
//       return NextResponse.json({ error: "Student already enrolled in this course" }, { status: 409 })
//     }
//     console.error("enroll-student error:", err)
//     return NextResponse.json({ error: "Failed to enroll student" }, { status: 500 })
//   }
// }


// app/api/admin/courses/[id]/enroll-student/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Role } from "@prisma/client"

type Params = { params: { id: string } }

/**
 * POST /api/admin/courses/[id]/enroll-student
 * Body: { studentId: string }
 * Creates a row in student_courses (unique by student_id+course_id)
 */
export async function POST(req: Request, { params }: Params) {
  const session = await getSession()

  // 🔑 FIX: use session.user.role instead of session.role
  if (!session || session.user?.role !== Role.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { studentId } = (await req.json()) as { studentId?: string }
    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 })
    }

    // Ensure both exist
    const [student, course] = await Promise.all([
      prisma.students.findUnique({ where: { id: studentId } }),
      prisma.courses.findUnique({ where: { id: params.id } }),
    ])
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    // Create link (unique constraint protects duplicates)
    const link = await prisma.student_courses.create({
      data: { student_id: studentId, course_id: params.id },
    })

    return NextResponse.json({ success: true, link })
  } catch (err: any) {
    if (String(err?.code) === "P2002") {
      return NextResponse.json({ error: "Student already enrolled in this course" }, { status: 409 })
    }
    console.error("enroll-student error:", err)
    return NextResponse.json({ error: "Failed to enroll student" }, { status: 500 })
  }
}
