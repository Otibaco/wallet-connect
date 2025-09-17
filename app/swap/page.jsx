// app/swap/page.js
"use client";
import { useState } from "react";
import axios from "axios";

export default function SwapPage() {
  const [fromCoin, setFromCoin] = useState("ETH");
  const [toCoin, setToCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [receive, setReceive] = useState("");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getQuote() {
    try {
      setLoading(true);
      // For demonstration we call server to fetch StealthEX quote
      const res = await axios.post("/api/swap", { fromCoin, toCoin, amount, action: "quote" });
      setQuote(res.data);
    } catch (err) {
      console.error(err);
      alert("Could not fetch quote");
    } finally {
      setLoading(false);
    }
  }

  async function doSwap() {
    try {
      setLoading(true);
      const res = await axios.post("/api/swap", { fromCoin, toCoin, amount, receive, action: "swap" }, { withCredentials: true });
      if (res.data?.ok) {
        alert("Swap requested. Check history.");
        setQuote(null);
      } else {
        alert("Swap failed");
      }
    } catch (err) {
      console.error(err);
      alert("Swap failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Swap</h2>
      <div className="p-4 bg-gray-800 rounded-xl">
        <div className="grid gap-3">
          <div>
            <label className="text-sm">From</label>
            <select value={fromCoin} onChange={(e)=>setFromCoin(e.target.value)} className="w-full p-2 rounded bg-gray-900">
              <option>ETH</option>
              <option>BTC</option>
              <option>USDT</option>
            </select>
          </div>

          <div>
            <label className="text-sm">To</label>
            <select value={toCoin} onChange={(e)=>setToCoin(e.target.value)} className="w-full p-2 rounded bg-gray-900">
              <option>BTC</option>
              <option>ETH</option>
              <option>USDT</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Amount</label>
            <input value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full p-2 rounded bg-gray-900" />
          </div>

          <div>
            <label className="text-sm">Receive to (wallet)</label>
            <input value={receive} onChange={(e)=>setReceive(e.target.value)} className="w-full p-2 rounded bg-gray-900" />
          </div>

          <div className="flex gap-2">
            <button onClick={getQuote} disabled={loading} className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">Get Quote</button>
            <button onClick={doSwap} disabled={loading} className="px-4 py-2 rounded-full border">Confirm Swap</button>
          </div>

          {quote && (
            <div className="mt-2 p-3 bg-gray-850 rounded">
              <p>You will receive ≈ {quote.estimate || "—"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
