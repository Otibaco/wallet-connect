// app/api/auth/verify/route.js
import connectToDatabase from "../../../../lib/db";
import Nonce from "../../../../models/Nonce";
import User from "../../../../models/User";
import { SiweMessage } from "siwe";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();
    const { message, signature } = body;
    if (!message || !signature) return new Response(JSON.stringify({ error: "Missing message or signature" }), { status: 400 });

    // Parse SIWE message
    let siwe;
    try {
      siwe = new SiweMessage(message);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid SIWE message" }), { status: 400 });
    }

    // Check nonce exists and is unused & not expired
    const nonceDoc = await Nonce.findOne({ nonce: siwe.nonce });
    if (!nonceDoc) return new Response(JSON.stringify({ error: "Nonce not found or expired" }), { status: 400 });
    if (nonceDoc.used) return new Response(JSON.stringify({ error: "Nonce already used" }), { status: 400 });
    if (nonceDoc.expiresAt < new Date()) return new Response(JSON.stringify({ error: "Nonce expired" }), { status: 400 });

    // Verify signature
    try {
      const verification = await siwe.verify({ signature });
      if (!verification.success) return new Response(JSON.stringify({ error: "Signature verification failed" }), { status: 401 });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Signature verification error" }), { status: 401 });
    }

    // Mark nonce used
    nonceDoc.used = true;
    await nonceDoc.save();

    // Upsert user (register if new, update lastLogin if existing)
    const walletAddr = siwe.address.toLowerCase();
    await User.findOneAndUpdate(
      { walletAddress: walletAddr },
      { $set: { lastLogin: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true }
    );

    // Issue JWT token containing wallet address
    const token = jwt.sign({ walletAddress: walletAddr }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

    // Create cookie
    const cookieParts = [`eriwa_jwt=${token}`, "HttpOnly", "Path=/", "SameSite=Lax"];
    if (process.env.NODE_ENV === "production") cookieParts.push("Secure");
    if (process.env.COOKIE_DOMAIN) cookieParts.push(`Domain=${process.env.COOKIE_DOMAIN}`);

    return new Response(JSON.stringify({ ok: true, walletAddress: walletAddr }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieParts.join("; ")
      }
    });
  } catch (err) {
    console.error("Verify route error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
