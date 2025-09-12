// // app/api/student/profile/route.ts
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { promises as fs } from "fs";
// import path from "path";
// import bcrypt from "bcrypt";

// export async function PATCH(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const contentType = req.headers.get("content-type") || "";
//     let fields: Record<string,string|undefined> = {};
//     let avatarFile: File | null = null;

//     if (contentType.startsWith("multipart/form-data")) {
//       const form = await req.formData();
//       fields.full_name = form.get("full_name")?.toString();
//       fields.username = form.get("username")?.toString();
//       fields.phone = form.get("phone")?.toString();
//       const f = form.get("avatar");
//       if (f && typeof (f as any).arrayBuffer === "function") avatarFile = f as File;
//     } else {
//       const body = await req.json().catch(()=>({}));
//       fields = body;
//     }

//     const update: any = {};
//     if (fields.full_name) update.full_name = fields.full_name;
//     if (fields.username) update.username = fields.username;
//     if (fields.phone) update.phone = fields.phone;

//     if (avatarFile) {
//       const buf = Buffer.from(await avatarFile.arrayBuffer());
//       const uploadsDir = path.join(process.cwd(), "public", "avatars");
//       await fs.mkdir(uploadsDir, { recursive: true });
//       const safeName = `${Date.now()}-${(avatarFile as any).name.replace(/\s+/g,"-")}`;
//       await fs.writeFile(path.join(uploadsDir,safeName), buf);
//       update.profile_image_url = `/avatars/${safeName}`;
//     }

//     if (Object.keys(update).length === 0) return NextResponse.json({ error: "No fields" }, { status: 400 });

//     const updated = await prisma.users.update({ where: { id: session.user.id }, data: update, select: { id:true, full_name:true, username:true, phone:true, profile_image_url:true } });
//     return NextResponse.json({ user: updated });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// app/api/student/profile/route.ts
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { promises as fs } from "fs";
// import path from "path";
// import bcrypt from "bcryptjs";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || (session.user as any)?.role !== "student") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = (session.user as any).id as string;

//     const user = await prisma.users.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         full_name: true,
//         username: true,
//         email: true,
//         phone: true,
//         profile_image_url: true,
//         created_at: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user });
//   } catch (err) {
//     console.error("GET /api/student/profile error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PATCH(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || (session.user as any)?.role !== "student") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     const userId = (session.user as any).id as string;

//     const contentType = req.headers.get("content-type") || "";
//     let updateData: any = {};

//     // handle multipart/form-data with avatar
//     if (contentType.startsWith("multipart/form-data")) {
//       const form = await req.formData();
//       const full_name = form.get("full_name")?.toString();
//       const username = form.get("username")?.toString();
//       const phone = form.get("phone")?.toString();
//       const avatar = form.get("avatar") as File | null;

//       if (full_name) updateData.full_name = full_name;
//       if (username) updateData.username = username;
//       if (phone) updateData.phone = phone;

//       if (avatar && typeof avatar.arrayBuffer === "function") {
//         const buffer = Buffer.from(await avatar.arrayBuffer());
//         const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
//         await fs.mkdir(uploadsDir, { recursive: true });
//         const originalName = (avatar as any).name || `avatar-${Date.now()}.png`;
//         const safeName = `${Date.now()}-${originalName.replace(/\s+/g, "-")}`;
//         const filePath = path.join(uploadsDir, safeName);
//         await fs.writeFile(filePath, buffer);
//         updateData.profile_image_url = `/uploads/avatars/${safeName}`;
//       }
//     } else {
//       // JSON body
//       const body = await req.json().catch(() => ({}));
//       if (body.full_name) updateData.full_name = String(body.full_name);
//       if (body.username) updateData.username = String(body.username);
//       if (typeof body.phone !== "undefined") updateData.phone = body.phone ?? null;
//     }

//     if (Object.keys(updateData).length === 0) {
//       return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
//     }

//     // try update, handle unique constraint errors for username/email
//     try {
//       const user = await prisma.users.update({
//         where: { id: userId },
//         data: updateData,
//         select: {
//           id: true,
//           full_name: true,
//           username: true,
//           email: true,
//           phone: true,
//           profile_image_url: true,
//         },
//       });

//       return NextResponse.json({ user });
//     } catch (prismaErr: any) {
//       // unique constraint error
//       console.error("Prisma update error:", prismaErr);
//       const msg =
//         prismaErr?.code === "P2002"
//           ? "Duplicate value for unique field (username or email)."
//           : "Failed to update user.";
//       return NextResponse.json({ error: msg }, { status: 400 });
//     }
//   } catch (err) {
//     console.error("PATCH /api/student/profile error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



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

    return NextResponse.json({
      user: {
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        username: updatedUser.username,
        phone: updatedUser.phone ?? undefined,
        image: updatedUser.profile_image_url ?? undefined,
      },
    });
  } catch (err) {
    console.error("❌ Error updating student profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
