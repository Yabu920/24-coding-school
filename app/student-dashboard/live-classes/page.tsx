// app/student-dashboard/live-classes/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function LiveClassesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") return <div>Access denied</div>;

  const student = await prisma.students.findUnique({ where: { user_id: session.user.id } });
  // find classes for student's courses
  const classes = await prisma.live_classes.findMany({
    where: { course_id: { in: (await prisma.student_courses.findMany({ where: { student_id: student?.id }, select: { course_id: true } })).map(x => x.course_id) } as any },
    orderBy: { start_time: "asc" },
    select: { id: true, title: true, start_time: true, end_time: true, video_url: true, course: { select: { name: true } } }
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Live Classes</h2>
      <div className="grid gap-4">
        {classes.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-gray-600">{c.course?.name}</div>
              <div className="text-sm text-gray-500">{new Date(c.start_time).toLocaleString()}</div>
            </div>
            {c.video_url ? (
              <a className="px-3 py-1 bg-blue-600 text-white rounded" href={c.video_url} target="_blank">Join</a>
            ) : (
              <span className="text-sm text-gray-500">No link</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
