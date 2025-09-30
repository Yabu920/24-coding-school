

// // lib/auth.ts
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "./authOptions"

// export async function getSessionServer(req: any, res: any) {
//   return await getServerSession(req, res, authOptions)
// }


// // lib/auth.ts
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "./authOptions" // keep this import

// // ✅ re-export so other files can import it
// export { authOptions }

// export async function getSessionServer(req: any, res: any) {
//   return await getServerSession(req, res, authOptions)
// }


// lib/auth.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "./authOptions"

export { authOptions }

export async function getSession() {
  return await getServerSession(authOptions) // ✅ no req/res needed
}

