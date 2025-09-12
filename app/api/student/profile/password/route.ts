// // app/api/student/profile/password/route.ts
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcrypt";

// export async function PUT(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json().catch(()=>({}));
//     const { currentPassword, newPassword } = body;
//     if (!currentPassword || !newPassword) return NextResponse.json({ error: "Missing" }, { status: 400 });

//     const user = await prisma.users.findUnique({ where: { id: session.user.id }, select: { password_hash: true } });
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     const match = await bcrypt.compare(currentPassword, user.password_hash);
//     if (!match) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });

//     const hashed = await bcrypt.hash(newPassword, 10);
//     await prisma.users.update({ where: { id: session.user.id }, data: { password_hash: hashed }});
//     return NextResponse.json({ message: "Password updated" });
//   } catch(err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// // app/api/student/profile/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import path from "path";
// import { promises as fs } from "fs";
// import bcrypt from "bcryptjs";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const user = await prisma.users.findUnique({
//       where: { id: session.user.id },
//       select: { id: true, full_name: true, email: true, username: true, phone: true, profile_image_url: true },
//     });

//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
//     return NextResponse.json({ user });
//   } catch (err) {
//     console.error("GET student profile", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// export async function PUT(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const contentType = req.headers.get("content-type") || "";
//     let fields: any = {};
//     let avatarFile: File | null = null;

//     if (contentType.startsWith("multipart/form-data")) {
//       const form = await req.formData();
//       fields.full_name = form.get("full_name")?.toString();
//       fields.username = form.get("username")?.toString();
//       fields.phone = form.get("phone")?.toString();
//       const f = form.get("avatar") as File | null;
//       if (f && typeof f.arrayBuffer === "function") avatarFile = f;
//     } else {
//       // JSON fallback
//       const body = await req.json().catch(() => ({}));
//       fields = body;
//     }

//     const updateData: any = {};
//     if (fields.full_name) updateData.full_name = fields.full_name;
//     if (fields.username) updateData.username = fields.username;
//     if (fields.phone) updateData.phone = fields.phone;

//     if (avatarFile) {
//       const arr = await avatarFile.arrayBuffer();
//       const buffer = Buffer.from(arr);
//       const uploadsDir = path.join(process.cwd(), "public", "uploads");
//       await fs.mkdir(uploadsDir, { recursive: true });
//       const safeName = `${Date.now()}-${(avatarFile as any).name?.replace(/\s+/g, "-") ?? "avatar.png"}`;
//       const filePath = path.join(uploadsDir, safeName);
//       await fs.writeFile(filePath, buffer);
//       updateData.profile_image_url = `/uploads/${safeName}`;
//     }

//     if (Object.keys(updateData).length === 0) {
//       return NextResponse.json({ error: "No updatable fields" }, { status: 400 });
//     }

//     const updated = await prisma.users.update({
//       where: { id: session.user.id },
//       data: updateData,
//       select: { id: true, full_name: true, email: true, username: true, phone: true, profile_image_url: true },
//     });

//     return NextResponse.json({ user: updated });
//   } catch (err) {
//     console.error("PUT student profile", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// app/api/student/profile/password/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { compare, hash } from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isValid = await compare(currentPassword, user.password_hash);
    if (!isValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    const hashed = await hash(newPassword, 10);

    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: hashed },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error updating password:", err);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
