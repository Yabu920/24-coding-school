
// app/api/admin/users/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

// PATCH /api/admin/users/:id
export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const updatedUser = await prisma.users.update({
      where: { id: params.id },
      data: {
        full_name: body.full_name,
        phone: body.phone,
        status: body.status,
        teacher: {
          upsert: {
            create: {
              experience_years: body.experience_years
                ? parseInt(body.experience_years)
                : null,
              subjects_taught: body.subjects_taught || null,
            },
            update: {
              experience_years: body.experience_years
                ? parseInt(body.experience_years)
                : null,
              subjects_taught: body.subjects_taught || null,
            },
          },
        },
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        teacher: {
          select: {
            experience_years: true,
            subjects_taught: true,
          },
        },
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE /api/admin/users/:id
export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.users.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
