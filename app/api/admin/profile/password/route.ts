
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcrypt";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "currentPassword and newPassword are required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { password_hash: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: session.user.id },
      data: { password_hash: hashed },
    });

    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    console.error("PUT /api/admin/profile/password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
