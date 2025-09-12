// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      full_name: true,
      email: true,
      username: true,
      profile_image_url: true,
      phone: true,
      role: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user }, { status: 200 });
}
