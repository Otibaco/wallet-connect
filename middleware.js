// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // protect specific paths
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/swap") || pathname.startsWith("/history") || pathname.startsWith("/profile")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // allow request
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/swap/:path*", "/history/:path*", "/profile/:path*"]
};
