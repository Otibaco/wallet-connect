// app/api/auth/nonce/route.js

import dbConnect from "@/lib/db";
import User from "@/models/User";


function generateNonce() {
  return Math.floor(Math.random() * 1000000).toString();
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) return new Response(JSON.stringify({ error: "wallet required" }), { status: 400 });

  await dbConnect();
  let user = await User.findOne({ walletAddress: wallet.toLowerCase() });
  if (!user) {
    user = await User.create({ walletAddress: wallet.toLowerCase(), nonce: generateNonce() });
  } else {
    user.nonce = generateNonce();
    await user.save();
  }

  // EIP-4361-like message (simplified)
  const message = `Sign this message to authenticate with ${process.env.NEXT_PUBLIC_APP_NAME || "CryptoNext"}.\n\nWallet: ${wallet}\nNonce: ${user.nonce}`;
  return new Response(JSON.stringify({ message }), { status: 200 });
}
