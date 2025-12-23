// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Public pages
//   const publicPaths = ["/signin", "/signup"];
//   if (publicPaths.some((path) => pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   // Get token + role
//   const token = req.cookies.get("auth_token")?.value || null;
//   const role = req.cookies.get("role")?.value || null; // "admin" or "user"

//   // Not logged in → redirect to signin
//   if (!token) {
//     return NextResponse.redirect(new URL("/signin", req.url));
//   }

//   // Admin route protection
//   if (pathname.startsWith("/admin") && role !== "admin") {
//     return NextResponse.redirect(new URL("/", req.url)); // non-admin → client
//   }

//   return NextResponse.next(); // authenticated users allowed
// }

// // Apply to client root and admin routes
// export const config = {
//   matcher: ["/", "/admin/:path*"],
// };
