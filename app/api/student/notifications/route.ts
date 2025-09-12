// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/authOptions";

// export async function GET() {
//   const session = await getServerSession({ ...authOptions });
//   if (!session || session.user.role !== "student") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const student = await prisma.students.findUnique({
//     where: { user_id: session.user.id },
//   });

//   if (!student) return NextResponse.json({ notifications: [] });

//   // New assignments (include created_at!)
//   const assignments = await prisma.student_assignments.findMany({
//     where: { student_id: student.id, submitted_at: null },
//     include: { assignment: { select: { title: true, created_at: true } } },
//     orderBy: { assignment: { created_at: "desc" } },
//   });

//   // Feedback
//   const feedbacks = await prisma.student_assignments.findMany({
//     where: { student_id: student.id, feedback: { not: null } },
//     include: { assignment: { select: { title: true, created_at: true } } },
//     orderBy: { submitted_at: "desc" },
//   });

//   const notif = [
//     ...assignments.map(a => ({
//       id: a.id,
//       type: "assignment",
//       message: `New assignment: ${a.assignment.title}`,
//       is_read: false,
//       created_at: a.assignment.created_at.toISOString(),
//     })),
//     ...feedbacks.map(f => ({
//       id: f.id,
//       type: "feedback",
//       message: `Assignment feedback: ${f.assignment.title}`,
//       is_read: false,
//       created_at: f.submitted_at!.toISOString(),
//     })),
//   ];

//   return NextResponse.json({ notifications: notif });
// }



import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notifications.findMany({
      where: { user_id: session.user.id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("❌ Failed to fetch notifications:", err);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
