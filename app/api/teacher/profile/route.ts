// app/api/teacher/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import path from "path";
import { writeFile } from "fs/promises";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/teacher/profile error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contentType = req.headers.get("content-type") ?? "";
    let payload: any = {};
    let uploadedUrl: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      payload.full_name = form.get("full_name")?.toString();
      payload.username = form.get("username")?.toString();
      payload.phone = form.get("phone")?.toString();

      const file = form.get("profile_image") as File | null;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${(file as any).name?.replace(/\s+/g, "-") || "img"}`;
        const dest = path.join(process.cwd(), "public", "uploads");
        await writeFile(path.join(dest, filename), buffer).catch(async () => {
          // try create dir then write
          await import("fs/promises").then(async ({ mkdir }) => {
            await mkdir(dest, { recursive: true });
            await writeFile(path.join(dest, filename), buffer);
          });
        });

        uploadedUrl = `/uploads/${filename}`;
      }
    } else {
      // JSON
      const body = await req.json().catch(() => ({}));
      payload.full_name = body.full_name;
      payload.username = body.username;
      payload.phone = body.phone;
    }

    const updateData: any = {};
    if (payload.full_name) updateData.full_name = payload.full_name;
    if (payload.username) updateData.username = payload.username;
    if (payload.phone !== undefined) updateData.phone = payload.phone;
    if (uploadedUrl) updateData.profile_image_url = uploadedUrl;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
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
    console.error("PATCH /api/teacher/profile error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
