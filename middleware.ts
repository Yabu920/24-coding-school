// // middleware.ts
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// const secret = process.env.NEXTAUTH_SECRET;

// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const url = new URL(req.url);

//   // Get JWT token from cookies
//   const token = await getToken({ req, secret });

//   // Role-based dashboard protection
//   if (url.pathname.startsWith("/student-dashboard")) {
//     if (!token || token.role !== "student") {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   if (url.pathname.startsWith("/teacher-dashboard")) {
//     if (!token || token.role !== "teacher") {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   if (url.pathname.startsWith("/admin-dashboard")) {
//     if (!token || token.role !== "admin") {
//       url.pathname = "/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   // Allow other routes
//   return NextResponse.next();
// }

// // Specify which paths to apply middleware
// export const config = {
//   matcher: [
//     "/student-dashboard/:path*",
//     "/teacher-dashboard/:path*",
//     "/admin-dashboard/:path*",
//   ],
// };




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
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/teacher-dashboard") && token.role !== "teacher") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith("/student-dashboard") && token.role !== "student") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (url.pathname.startsWith("/admin-dashboard") && token.role !== "admin") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher-dashboard/:path*", "/student-dashboard/:path*", "/admin-dashboard/:path*"],
};
