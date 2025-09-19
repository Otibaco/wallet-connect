// app/api/webhook/stealthex/route.js
import connectToDatabase from "../../../../lib/db";
import Swap from "../../../../models/Swap";

export async function POST(request) {
  await connectToDatabase();

  const secret = request.headers.get("x-webhook-secret");
  if (!process.env.WEBHOOK_SECRET || secret !== process.env.WEBHOOK_SECRET) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await request.json();
  const { orderId, status, txHash, toAddress } = body;
  if (!orderId) return new Response(JSON.stringify({ error: "Missing orderId" }), { status: 400 });

  const swap = await Swap.findOne({ providerOrderId: orderId });
  if (!swap) return new Response(JSON.stringify({ error: "Swap not found" }), { status: 404 });

  swap.status = status || swap.status;
  if (txHash) swap.providerTxHash = txHash;
  if (toAddress) swap.destinationAddress = toAddress;
  await swap.save();

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
