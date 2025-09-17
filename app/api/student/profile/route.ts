// app/api/student/profile/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import path from "path";
import { promises as fs } from "fs";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        full_name: true,
        email: true,
        username: true,
        phone: true,
        profile_image_url: true,
      },
    });

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        image: user.profile_image_url ?? undefined,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching student profile:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const fullName = formData.get("fullName")?.toString();
    const email = formData.get("email")?.toString();
    const username = formData.get("username")?.toString();
    const phone = formData.get("phone")?.toString();
    const profileImage = formData.get("profileImage") as File | null;

    let profileImageUrl: string | undefined;
    if (profileImage && typeof profileImage.arrayBuffer === "function") {
      const buffer = Buffer.from(await profileImage.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), "public", "profiles");
      await fs.mkdir(uploadsDir, { recursive: true });
      const safeName = `${Date.now()}-${profileImage.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadsDir, safeName);
      await fs.writeFile(filePath, buffer);
      profileImageUrl = `/profiles/${safeName}`;
    }

    // Update users table
    const updatedUser = await prisma.users.update({
      where: { id: session.user.id },
      data: {
        full_name: fullName || undefined,
        email: email || undefined,
        username: username || undefined,
        phone: phone || undefined,
        profile_image_url: profileImageUrl || undefined,
      },
    });

    // Create notification for profile update and return it
    const createdNotification = await prisma.notifications.create({
      data: {
        user_id: session.user.id,
        type: "profile_update",
        message: "👤 Your profile was updated successfully.",
      },
    });

    return NextResponse.json({
      user: {
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        username: updatedUser.username,
        phone: updatedUser.phone ?? undefined,
        image: updatedUser.profile_image_url ?? undefined,
      },
      notification: createdNotification, // <- return the created notification
    });
  } catch (err) {
    console.error("❌ Error updating student profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

