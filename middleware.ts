
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret });

  if (
    url.pathname.startsWith("/teacher-dashboard") ||
    url.pathname.startsWith("/student-dashboard") ||
    url.pathname.startsWith("/admin-dashboard")
  ) {
    if (!token) {
      url.pathname = "/"; 
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/teacher-dashboard") && token.role !== "teacher") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith("/student-dashboard") && token.role !== "student") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith("/admin-dashboard") && token.role !== "admin") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher-dashboard/:path*", "/student-dashboard/:path*", "/admin-dashboard/:path*"],
};
