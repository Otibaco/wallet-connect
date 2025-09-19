// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PROTECTED = ["/dashboard", "/swap", "/history", "/profile", "/api/swaps", "/api/swap"];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  if (!PROTECTED.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = request.cookies.get("eriwa_jwt")?.value;
  if (!token) {
    const url = new URL("/", request.url);
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    const url = new URL("/", request.url);
    url.searchParams.set("auth", "required");
    return NextResponse.redirect(url);
  }
}

export const config = { matcher: ["/dashboard/:path*", "/swap/:path*", "/history/:path*", "/profile/:path*"] };
