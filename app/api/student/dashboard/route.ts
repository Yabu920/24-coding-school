// app/api/student/dashboard/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 })
  }

  try {
    // 1️⃣ Get the student record
    const student = await prisma.students.findUnique({
      where: { user_id: session.user.id },
      include: { student_courses: { include: { course: true } }, 
      student_assignments: {
      include: { assignment: { include: { course: true } } }, // <-- include assignment and course
    }, certificates: true },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // 2️⃣ Count enrolled courses
    const coursesCount = student.student_courses.length

    // 3️⃣ Upcoming assignments
    const now = new Date()
    const upcomingAssignments = student.student_assignments.filter((sa) => !sa.submitted_at)

    // 4️⃣ Certificates count
    const certificatesCount = student.certificates.length

    // 5️⃣ Recent graded assignment (descending by submission date)
    const gradedAssignments = student.student_assignments
      .filter((sa) => sa.grade)
      .sort((a, b) => (b.submitted_at ? b.submitted_at.getTime() : 0) - (a.submitted_at ? a.submitted_at.getTime() : 0))
    
    const recentGrade = gradedAssignments[0]
      ? {
          course: recentGradeCourseName(student, gradedAssignments[0]),
          grade: gradedAssignments[0].grade,
          feedback: gradedAssignments[0].feedback || null,
        }
      : null

    // 6️⃣ Assignment Status Pie chart
    // 6️⃣ Assignment Status Pie chart
const assignmentStatus = [
  { name: "Submitted", value: student.student_assignments.filter((sa) => sa.submitted_at).length },
  {
    name: "Pending",
    value: student.student_assignments.filter(
      (sa) =>
        !sa.submitted_at &&
        sa.assignment?.due_date &&
        new Date(sa.assignment.due_date).getTime() >= now.getTime()
    ).length,
  },
  {
    name: "Overdue",
    value: student.student_assignments.filter(
      (sa) =>
        !sa.submitted_at &&
        sa.assignment?.due_date &&
        new Date(sa.assignment.due_date).getTime() < now.getTime()
    ).length,
  },
]


    // 7️⃣ Grades per course (Bar chart)
    const gradeDataMap: Record<string, { course: string; total: number; count: number }> = {}
    for (const sa of student.student_assignments) {
      if (sa.grade && sa.assignment?.course?.name) {
        const cname = sa.assignment.course.name
        if (!gradeDataMap[cname]) gradeDataMap[cname] = { course: cname, total: 0, count: 0 }
        gradeDataMap[cname].total += parseFloat(sa.grade)
        gradeDataMap[cname].count += 1
      }
    }
    const gradeData = Object.values(gradeDataMap).map((g) => ({ course: g.course, grade: g.count > 0 ? g.total / g.count : 0 }))

    return NextResponse.json({
      stats: {
        courses: coursesCount,
        assignments: upcomingAssignments.length,
        certificates: certificatesCount,
        recentGrade,
      },
      assignmentStatus,
      gradeData,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Helper to get course name of a graded assignment
function recentGradeCourseName(student: any, sa: any) {
  const course = student.student_courses.find((sc: any) => sc.course.id === sa.assignment?.course_id)
  return course?.course?.name || "Unknown"
}
