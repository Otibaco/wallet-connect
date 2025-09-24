import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({ user: payload });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
