// // app/api/notifications/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = getSession();
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     // messages directed to current user (latest 20)
//     const messages = await prisma.messages.findMany({
//       where: { receiver_id: session.sub },
//       include: {
//         sender: {
//           select: { id: true, full_name: true, profile_image_url: true },
//         },
//       },
//       orderBy: { sent_at: "desc" },
//       take: 30,
//     });

//     // announcements (latest 10)
//     const announcements = await prisma.announcements.findMany({
//       orderBy: { created_at: "desc" },
//       take: 10,
//     });

//     const msgNotes = messages.map((m) => ({
//       id: m.id,
//       type: "message",
//       content: m.content,
//       senderName: m.sender?.full_name ?? null,
//       time: m.sent_at.toISOString(),
//       read: m.read_status,
//     }));

//     const annNotes = announcements.map((a) => ({
//       id: a.id,
//       type: "announcement",
//       title: a.title,
//       content: a.message,
//       time: a.created_at.toISOString(),
//       read: false,
//     }));

//     // combine and sort by time desc
//     const notifications = [...msgNotes, ...annNotes].sort((a, b) => (a.time < b.time ? 1 : -1));

//     return NextResponse.json({ notifications });
//   } catch (err) {
//     console.error("GET /api/notifications error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }




// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await prisma.notifications.findMany({
      where: { user_id: session.sub },
      orderBy: { created_at: "desc" },
      take: 30,
    });

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
