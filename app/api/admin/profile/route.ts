
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcrypt";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        full_name: true,
        email: true,
        username: true,
        phone: true,
        profile_image_url: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/admin/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let fields: Record<string, string | undefined> = {};
    let avatarFile: File | null = null;

    if (contentType.startsWith("multipart/form-data")) {
      const form = await req.formData();
      fields.full_name = form.get("full_name")?.toString();
      fields.email = form.get("email")?.toString();
      fields.phone = form.get("phone")?.toString();
      fields.username = form.get("username")?.toString();
      fields.password = form.get("password")?.toString();
      const file = form.get("avatar");
      if (file && typeof (file as any).arrayBuffer === "function") {
        avatarFile = file as File;
      }
    } else {
      const body = await req.json().catch(() => ({}));
      fields.full_name = body.full_name;
      fields.email = body.email;
      fields.phone = body.phone;
      fields.username = body.username;
      fields.password = body.password;
    }

    const updateData: Record<string, any> = {};
    if (fields.full_name) updateData.full_name = fields.full_name;
    if (fields.email) updateData.email = fields.email;
    if (fields.phone) updateData.phone = fields.phone;
    if (fields.username) updateData.username = fields.username;
    if (fields.password) {
      const hashed = await bcrypt.hash(fields.password, 10);
      updateData.password_hash = hashed;
    }

    if (avatarFile) {
      const arr = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arr);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const originalName = (avatarFile as any).name || `avatar-${Date.now()}.png`;
      const safeName = `${Date.now()}-${originalName.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadsDir, safeName);
      await fs.writeFile(filePath, buffer);
      updateData.profile_image_url = `/uploads/${safeName}`;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    const user = await prisma.users.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        full_name: true,
        email: true,
        username: true,
        phone: true,
        profile_image_url: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("PUT /api/admin/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
