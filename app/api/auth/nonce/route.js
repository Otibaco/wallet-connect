// app/api/auth/nonce/route.js
import connectToDatabase from "../../../../lib/db";
import Nonce from "../../../../models/Nonce";
import crypto from "crypto";

export async function GET() {
  await connectToDatabase();
  const nonce = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  const n = new Nonce({ nonce, expiresAt });
  await n.save();
  return new Response(JSON.stringify({ nonce }), { status: 200, headers: { "Content-Type": "application/json" } });
}
