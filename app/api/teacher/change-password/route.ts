
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { compare, hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: "oldPassword and newPassword required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const ok = await compare(oldPassword, user.password_hash);
    if (!ok) return NextResponse.json({ error: "Old password incorrect" }, { status: 400 });

    const hashed = await hash(newPassword, 10);
    await prisma.users.update({ where: { id: user.id }, data: { password_hash: hashed } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/teacher/change-password error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
