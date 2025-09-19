// app/api/swap/route.js
import connectToDatabase from "../../../../lib/db";
import Swap from "../../../../models/Swap";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { ethers } from "ethers";

async function getJwtWallet(request) {
  const token = request.cookies.get("eriwa_jwt")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.walletAddress;
  } catch {
    return null;
  }
}

export async function POST(request) {
  await connectToDatabase();

  const wallet = await getJwtWallet(request);
  if (!wallet) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await request.json();
  const { fromCurrency, toCurrency, fromAmount, destinationAddress } = body;
  if (!fromCurrency || !toCurrency || !fromAmount || !destinationAddress) return new Response(JSON.stringify({ error: "Missing" }), { status: 400 });

  if (!process.env.STEALTHEX_API_KEY) {
    const depositAddress = ethers.Wallet.createRandom().address;
    const providerOrderId = `stub-${randomBytes(6).toString("hex")}`;
    const swap = new Swap({ userWallet: wallet, fromCurrency, toCurrency, fromAmount, depositAddress, providerOrderId, destinationAddress, status: "waiting_for_deposit" });
    await swap.save();
    return new Response(JSON.stringify({ depositAddress, providerOrderId, swapId: swap._id }), { status: 200 });
  }

  // TODO: integrate real provider call with STEALTHEX_API_KEY/SECRET
  const depositAddress = ethers.Wallet.createRandom().address;
  const providerOrderId = `realstub-${randomBytes(6).toString("hex")}`;
  const swap = new Swap({ userWallet: wallet, fromCurrency, toCurrency, fromAmount, depositAddress, providerOrderId, destinationAddress, status: "waiting_for_deposit" });
  await swap.save();
  return new Response(JSON.stringify({ depositAddress, providerOrderId, swapId: swap._id }), { status: 200 });
}
