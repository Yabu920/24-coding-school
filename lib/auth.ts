

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
import { cookies } from "next/headers"

export { authOptions }

export async function getSession() {
  const session = await getServerSession(authOptions)
  return session
}

// ✅ Add this function
export function clearSessionCookie() {
  const cookieStore = cookies()
  cookieStore.set("next-auth.session-token", "", { expires: new Date(0) })
  cookieStore.set("__Secure-next-auth.session-token", "", { expires: new Date(0) })
}