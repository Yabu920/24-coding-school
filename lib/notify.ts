// lib/notify.ts
import { prisma } from "@/lib/prisma"

export async function createNotification(userId: string, type: string, message: string) {
  return prisma.notifications.create({
    data: {
      user_id: userId,
      type,
      message,
    },
  })
}
