// app/api/swap/route.js
import dbConnect from "../../../lib/db";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";
import axios from "axios";
import { verifyToken } from "../../../utils/jwt";
import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();
  const { fromCoin, toCoin, amount, receive, action } = body;

  // check auth (for swap action)
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const userData = token ? verifyToken(token) : null;
  if (!userData && action === "swap") {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), { status: 401 });
  }

  await dbConnect();

  if (action === "quote") {
    // Call StealthEX quote endpoint (this is pseudo-code; adapt to real API)
    // We'll return a fake estimate for demo
    const estimate = (Number(amount || 0) * 0.97).toFixed(6); // fake
    return new Response(JSON.stringify({ estimate }));
  }

  if (action === "swap") {
    const user = await User.findOne({ walletAddress: userData.walletAddress });
    // create transaction record
    const tx = await Transaction.create({
      user: user._id,
      fromCoin,
      toCoin,
      amountFrom: Number(amount),
      amountTo: null,
      receiveAddress: receive,
      status: "pending"
    });

    try {
      // PSEUDO: call StealthEX create-swap endpoint
      // const res = await axios.post('https://api.stealthex.io/swap', {...}, {headers:{ 'API-Key': process.env.STEALTHEX_API_KEY }});
      // for now simulate success and externalId
      const externalId = `demo-${Date.now()}`;
      tx.externalId = externalId;
      tx.amountTo = Number(amount) * 0.97; // demo received
      tx.status = "pending";
      await tx.save();

      return new Response(JSON.stringify({ ok: true, txId: tx._id }));
    } catch (err) {
      console.error(err);
      tx.status = "failed";
      await tx.save();
      return new Response(JSON.stringify({ ok: false, error: "swap_failed" }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ ok: false, error: "invalid action" }), { status: 400 });
}
