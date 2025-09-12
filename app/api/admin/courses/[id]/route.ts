import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { Role } from "@prisma/client"

type Params = { params: { id: string } }

/**
 * GET /api/admin/courses/[id]
 * Minimal fetch; no relation includes
 */
export async function GET(_req: Request, { params }: Params) {
  const session = await getSession()
  if (!session || session.role !== Role.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const course = await prisma.courses.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, description: true, created_at: true },
    })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    return NextResponse.json({ course })
  } catch (err) {
    console.error("GET /api/admin/courses/[id] error:", err)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/courses/[id]
 * Body: { name?: string; description?: string }
 */
export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession()
  if (!session || session.role !== Role.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, description } = (await req.json()) as {
      name?: string
      description?: string
    }

    const course = await prisma.courses.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
      },
      select: { id: true, name: true, description: true, created_at: true },
    })

    return NextResponse.json({ course })
  } catch (err: any) {
    if (String(err?.code) === "P2025") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    console.error("PATCH /api/admin/courses/[id] error:", err)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/courses/[id]
 */
export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession()
  if (!session || session.role !== Role.admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.courses.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (String(err?.code) === "P2025") {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    console.error("DELETE /api/admin/courses/[id] error:", err)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
