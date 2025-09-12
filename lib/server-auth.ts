// lib/server-auth.ts
import jwt from "jsonwebtoken"
import type { Role } from "@prisma/client"

type TokenPayload = {
  sub: string // user id
  role: Role
  name: string
  email: string
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me"

// Read JWT from cookies (server-safe)
export function getSessionFromRequest(req: Request): TokenPayload | null {
  try {
    const cookie = req.headers.get("cookie") || ""
    const match = cookie.match(/session=([^;]+)/)
    if (!match) return null

    const token = match[1]
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}
