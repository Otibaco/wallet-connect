// app/api/swaps/route.js
import connectToDatabase from "../../../../lib/db";
import Swap from "../../../../models/Swap";
import jwt from "jsonwebtoken";

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

export async function GET(request) {
  await connectToDatabase();
  const wallet = await getJwtWallet(request);
  if (!wallet) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const swaps = await Swap.find({ userWallet: wallet }).sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify({ swaps }), { status: 200 });
}
