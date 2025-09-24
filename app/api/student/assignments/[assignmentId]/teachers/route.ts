// // app/api/student/assignments/[assignmentId]/teachers/route.ts
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";


// export async function GET(
//   req: Request,
//   { params }: { params: { assignmentId: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "student") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { assignmentId } = params;

//   // Get the assignment with its course
//   const assignment = await prisma.assignments.findUnique({
//     where: { id: assignmentId },
//     include: { course: true },
//   });

//   if (!assignment || !assignment.course_id) {
//     return NextResponse.json({ teachers: [] });
//   }

//   // Fetch all teachers in this course
//   const teacherCourses = await prisma.teacher_courses.findMany({
//     where: { course_id: assignment.course_id },
//     include: {
//       teacher: {
//         include: { user: true },
//       },
//     },
//   });

//   const teachers = teacherCourses.map((tc) => ({
//     id: tc.teacher.id,
//     full_name: tc.teacher.user.full_name,
//   }));

//   return NextResponse.json({ teachers });
// }

// app/api/student/assignments/[assignmentId]/teachers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { assignmentId } = params;

  const assignment = await prisma.assignments.findUnique({
    where: { id: assignmentId },
    include: { course: { include: { teacher_courses: { include: { teacher: { include: { user: true } } } } } } },
  });

  if (!assignment || !assignment.course) return NextResponse.json({ teachers: [] });

  const teachers = assignment.course.teacher_courses.map((tc) => ({
    id: tc.teacher.id,
    full_name: tc.teacher.user.full_name,
  }));

  return NextResponse.json({ teachers });
}
