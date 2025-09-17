// app/api/auth/verify/route.js

import { NextResponse } from "next/server";
import { verifyMessage } from "ethers"; // ✅ direct import in v6
import cookie from "cookie";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/utils/jwt";

export async function POST(req) {
  const body = await req.json();
  const { address, signature } = body;
  if (!address || !signature) {
    return new Response(JSON.stringify({ ok: false, error: "missing" }), { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ walletAddress: address.toLowerCase() });
  if (!user) {
    return new Response(JSON.stringify({ ok: false, error: "user not found" }), { status: 404 });
  }

  // recreate message
  const message = `Sign this message to authenticate with ${process.env.NEXT_PUBLIC_APP_NAME || "CryptoNext"}.\n\nWallet: ${address}\nNonce: ${user.nonce}`;

  try {
    // ✅ ethers v6 style
    const recovered = verifyMessage(message, signature);

    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return new Response(JSON.stringify({ ok: false, error: "invalid signature" }), { status: 401 });
    }

    // signature valid: assign new nonce
    user.nonce = Math.floor(Math.random() * 1000000).toString();
    await user.save();

    const token = signToken({ walletAddress: address.toLowerCase() });

    // set cookie
    const res = NextResponse.json({ ok: true });
    res.headers.append(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );

    return res;
  } catch (err) {
    console.error("Signature verification failed:", err);
    return new Response(JSON.stringify({ ok: false, error: "verification failed" }), { status: 500 });
  }
}
