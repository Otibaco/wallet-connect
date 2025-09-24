import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    await connectDB();

    // Generate nonce
    const nonce = crypto.randomBytes(16).toString("hex");

    // Create or update user with nonce
    let user = await User.findOne({ walletAddress: address });
    if (!user) {
      user = await User.create({ walletAddress: address, nonce });
    } else {
      user.nonce = nonce;
      await user.save();
    }

    return NextResponse.json({ nonce });
    
  } catch (err) {
    toast("❌ Nonce error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
