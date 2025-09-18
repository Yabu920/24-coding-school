import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Get JWT token from cookies
  const token = await getToken({ req, secret });

  // Role-based dashboard protection
  if (url.pathname.startsWith("/student-dashboard")) {
    if (!token || token.role !== "student") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith("/teacher-dashboard")) {
    if (!token || token.role !== "teacher") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith("/admin-dashboard")) {
    if (!token || token.role !== "admin") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow other routes
  return NextResponse.next();
}

// Specify which paths to apply middleware
export const config = {
  matcher: [
    "/student-dashboard/:path*",
    "/teacher-dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
};
