// app/api/balances/route.js
import fetch from "isomorphic-unfetch";

export async function GET(request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const chain = url.searchParams.get("chain") || "eth";

  if (!address) return new Response(JSON.stringify({ error: "address required" }), { status: 400 });

  const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
  if (!MORALIS_API_KEY) {
    // return stub
    return new Response(JSON.stringify({ result: [{ token_address: "0x0", name: "ETH", symbol: "ETH", balance: "1000000000000000000" }] }), { status: 200 });
  }

  try {
    const resp = await fetch(`https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chain}`, {
      headers: { "X-API-Key": MORALIS_API_KEY, accept: "application/json" }
    });
    const data = await resp.json();
    return new Response(JSON.stringify({ result: data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Moralis error" }), { status: 500 });
  }
}
