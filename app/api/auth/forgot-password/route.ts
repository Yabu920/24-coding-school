// app/api/auth/forgot-password/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Find the user by email
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      // Do not reveal if email exists — security best practice
      return NextResponse.json({
        message: "If this email exists, you will receive a reset link",
      });
    }

    // 2. Generate token & expiration (1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // 3. Save token in database
    await prisma.password_resets.create({
      data: {
        user_id: user.id,
        token,
        expires_at: expiresAt,
      },
    });

    // 4. Send reset email
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    console.log("Password reset link:", resetLink); // for dev

    try {
      await sendEmail(
        user.email,
        "Reset Your Password",
        `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        `Click here to reset your password: ${resetLink}`
      );
    } catch (emailErr) {
      console.error("❌ Error sending email:", emailErr);
      return NextResponse.json(
        { error: "Failed to send reset link" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "If this email exists, you will receive a reset link",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
