import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") redirect("/")

  const teacher = await prisma.teachers.findUnique({ where: { user_id: session.user.id } })
  if (!teacher) redirect("/")

  const tcs = await prisma.teacher_courses.findMany({
    where: { teacher_id: teacher.id },
    include: {
      course: {
        include: {
          student_courses: {
            include: {
              student: { include: { user: true } },
            },
          },
        },
      },
    },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Courses</h1>
        <p className="text-gray-500">Your assigned courses and student counts.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tcs.map((tc) => {
          const c = tc.course
          const studentCount = c.student_courses.length
          return (
            <div key={c.id} className="rounded-xl bg-white shadow p-5 border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{c.name}</div>
                  {c.description && (
                    <div className="text-gray-600 text-sm mt-1 line-clamp-2">{c.description}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Students</div>
                  <div className="text-xl font-bold">{studentCount}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Active course
              </div>
            </div>
          )
        })}
        {tcs.length === 0 && (
          <div className="text-gray-500">No courses assigned yet.</div>
        )}
      </div>
    </div>
  )
}
