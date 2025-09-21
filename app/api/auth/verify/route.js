import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address missing" },
        { status: 400 }
      );
    }

    // 1. Connect to DB
    await connectDB();

    // 2. Find or create user
    let user = await User.findOne({ walletAddress: address });
    if (!user) {
      user = await User.create({ walletAddress: address });
    }

    // 3. Create JWT (with jose)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({
      id: user._id.toString(),
      walletAddress: user.walletAddress,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // 4. Set cookie with token
    const res = NextResponse.json({ success: true, user });
    res.cookies.set("token", token, {
      httpOnly: true, // not accessible from JS
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 24, // 1 day
      path: "/", // valid for whole site
    });

    return res;
  } catch (err) {
    console.error("❌ Auth verify error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
