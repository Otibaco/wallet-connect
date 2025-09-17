// app/api/balance/route.js
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) return new Response(JSON.stringify({ error: "wallet required" }), { status: 400 });

  const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
  if (!MORALIS_API_KEY) return new Response(JSON.stringify({ error: "no moralis key" }), { status: 500 });

  try {
    // Example Moralis endpoint (server-side): fetch native balance + token balances
    // Adjust endpoints according to Moralis docs/version.
    const chain = "eth"; // you could accept chain param
    const url = `https://deep-index.moralis.io/api/v2/${wallet}/balances?chain=${chain}`;
    const res = await axios.get(url, { headers: { "X-API-Key": MORALIS_API_KEY } });
    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return new Response(JSON.stringify({ error: "failed" }), { status: 500 });
  }
}
