// // app/api/auth/forgot-password/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      // Do not reveal existence
      return NextResponse.json({
        message: " you will receive a reset link",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.password_resets.create({
      data: {
        user_id: user.id,
        token,
        expires_at: expiresAt,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    console.log("Password reset link:", resetLink);

    await sendEmail(
      user.email,
      "Reset Your Password",
      `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      `Click here to reset your password: ${resetLink}`
    );

    return NextResponse.json({
      message: "If this email exists, you will receive a reset link",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
