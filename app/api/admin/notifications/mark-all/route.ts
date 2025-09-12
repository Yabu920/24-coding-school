// // app/api/notifications/mark-all/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function PUT() {
//   try {
//     const session = getSession();
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const result = await prisma.messages.updateMany({
//       where: { receiver_id: session.sub, read_status: false },
//       data: { read_status: true },
//     });

//     return NextResponse.json({ updated: result.count });
//   } catch (err) {
//     console.error("PUT /api/notifications/mark-all error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }





// app/api/notifications/mark-all/route.ts
// app/api/notifications/mark-all/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await prisma.notifications.updateMany({
      where: { user_id: session.sub, is_read: false },
      data: { is_read: true },
    });

    return NextResponse.json({ updated: result.count });
  } catch (err) {
    console.error("PUT /api/notifications/mark-all error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

