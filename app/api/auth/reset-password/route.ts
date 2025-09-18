// app/auth/reset-password/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Invalid token or password too short" },
        { status: 400 }
      );
    }

    // 1. Find reset token
    const resetEntry = await prisma.password_resets.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetEntry) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // 2. Check expiration
    if (resetEntry.expires_at < new Date()) {
      // Token expired — delete it
      await prisma.password_resets.delete({ where: { id: resetEntry.id } });
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // 3. Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: resetEntry.user_id },
      data: { password_hash: hashedPassword },
    });

    // 4. Delete used token
    await prisma.password_resets.delete({ where: { id: resetEntry.id } });

    return NextResponse.json({ message: "Password successfully reset" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
