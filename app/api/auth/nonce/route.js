import { NextResponse } from "next/server";
import crypto from "crypto";

// Store nonce in-memory (or Redis/DB in production)
let nonces = {};

export async function GET(req) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const ip = req.headers.get("x-forwarded-for") || "global";
  nonces[ip] = nonce;

  return NextResponse.json({ nonce });
}

// Export for verify route to access
export function getNonce(ip) {
  return nonces[ip];
}

export function clearNonce(ip) {
  delete nonces[ip];
}
