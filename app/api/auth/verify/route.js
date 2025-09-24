import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyMessage } from "viem";
import { SignJWT } from "jose";

export async function POST(req) {
  try {
    const { address, signature, message } = await req.json();
    if (!address || !signature || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ walletAddress: address });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    // Verify signed nonce
    const valid = await verifyMessage({
      address,
      message,
      signature,
    });

    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Clear nonce after use
    user.nonce = null;
    await user.save();

    // Issue JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      id: user._id.toString(),
      walletAddress: user.walletAddress,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    const res = NextResponse.json({ success: true, user });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("❌ Verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
