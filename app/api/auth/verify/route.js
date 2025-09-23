import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { SignJWT } from "jose";
import { verifyMessage } from "viem";
import { getNonce, clearNonce } from "../nonce/route";

export async function POST(req) {
  try {
    const { address, signature } = await req.json();

    if (!address || !signature) {
      return NextResponse.json({ error: "Missing address or signature" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") || "global";
    const nonce = getNonce(ip);
    if (!nonce) {
      return NextResponse.json({ error: "Nonce expired or missing" }, { status: 400 });
    }

    // Verify signature
    const valid = await verifyMessage({
      address,
      message: nonce,
      signature,
    });

    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Clear nonce after use
    clearNonce(ip);

    // Connect DB
    await connectDB();

    // Find or create user
    let user = await User.findOne({ walletAddress: address });
    if (!user) {
      user = await User.create({ walletAddress: address });
    }

    // Issue JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      id: user._id.toString(),
      walletAddress: user.walletAddress,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    // Send response with cookie
    const res = NextResponse.json({ success: true, user });
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("❌ Auth verify error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
