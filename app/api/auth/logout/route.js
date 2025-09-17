// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import cookie from "cookie";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", cookie.serialize("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax"
  }));
  return res;
}
