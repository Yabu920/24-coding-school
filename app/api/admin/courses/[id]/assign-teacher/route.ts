// // app/api/admin/courses/[id]/assign-teacher/route.ts
// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getSession } from "@/lib/auth"
// import { Role } from "@prisma/client"

// type Params = { params: { id: string } }

// /**
//  * POST /api/admin/courses/[id]/assign-teacher
//  * Body: { teacherId: string }
//  * Creates a row in teacher_courses (unique by teacher_id+course_id)
//  */
// export async function POST(req: Request, { params }: Params) {
//   const session = await getSession()
//   if (!session || session.role !== Role.admin) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const { teacherId } = (await req.json()) as { teacherId?: string }
//     if (!teacherId) {
//       return NextResponse.json({ error: "teacherId is required" }, { status: 400 })
//     }

//     // Ensure both exist
//     const [teacher, course] = await Promise.all([
//       prisma.teachers.findUnique({ where: { id: teacherId } }),
//       prisma.courses.findUnique({ where: { id: params.id } }),
//     ])
//     if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
//     if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

//     // Create link (unique constraint protects duplicates)
//     const link = await prisma.teacher_courses.create({
//       data: { teacher_id: teacherId, course_id: params.id },
//     })

//     return NextResponse.json({ success: true, link })
//   } catch (err: any) {
//     // Unique violation => already assigned
//     if (String(err?.code) === "P2002") {
//       return NextResponse.json({ error: "Teacher already assigned to this course" }, { status: 409 })
//     }
//     console.error("assign-teacher error:", err)
//     return NextResponse.json({ error: "Failed to assign teacher" }, { status: 500 })
//   }
// }


// app/api/admin/courses/[id]/assign-teacher/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"

type Params = { params: { id: string } }

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions) // ✅ correct for app router
  if (!session || session.user.role !== Role.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { teacherId } = (await req.json()) as { teacherId?: string }
    if (!teacherId) {
      return NextResponse.json({ error: "teacherId is required" }, { status: 400 })
    }

    const [teacher, course] = await Promise.all([
      prisma.teachers.findUnique({ where: { id: teacherId } }),
      prisma.courses.findUnique({ where: { id: params.id } }),
    ])
    if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    const link = await prisma.teacher_courses.create({
      data: { teacher_id: teacherId, course_id: params.id },
    })

    return NextResponse.json({ success: true, link })
  } catch (err: any) {
    if (String(err?.code) === "P2002") {
      return NextResponse.json({ error: "Teacher already assigned to this course" }, { status: 409 })
    }
    console.error("assign-teacher error:", err)
    return NextResponse.json({ error: "Failed to assign teacher" }, { status: 500 })
  }
}

