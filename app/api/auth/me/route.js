import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ user: decoded });
  } catch (err) {
    return NextResponse.json({ user: null });
    
  }
}
