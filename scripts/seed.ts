import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = "admin@24codingschool.com"
  const username = "admin"

  // Check if admin already exists
  const existing = await prisma.users.findFirst({
    where: { OR: [{ email }, { username }] },
  })

  if (existing) {
    console.log("Admin already exists:", existing.email)
    return
  }

  // Hash the password
  const password_hash = await bcrypt.hash("Admin@123", 10)

  // Create the admin user
  const admin = await prisma.users.create({
    data: {
      role: "admin",
      full_name: "Administrator",
      email,
      username,
      password_hash,  // ✅ must match your schema
      phone: "",
      status: "active",
    },
  })

  console.log("Seeded admin:", admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
