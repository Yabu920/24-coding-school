// // app/api/notifications/[id]/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const session = getSession();
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { id } = params;
//     if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

//     // ensure it belongs to current user
//     await prisma.messages.updateMany({
//       where: { id, receiver_id: session.sub },
//       data: { read_status: true },
//     });

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("PATCH /api/notifications/[id] error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



// app/api/notifications/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await prisma.notifications.updateMany({
      where: { id, user_id: session.sub },
      data: { is_read: true },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/notifications/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
