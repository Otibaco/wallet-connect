// app/components/SwapForm.jsx
"use client";
import { useState } from "react";

export default function SwapForm() {
  const [fromCurrency, setFromCurrency] = useState("ETH");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [swapResult, setSwapResult] = useState(null);

  async function handleSwap(e) {
    e.preventDefault();
    setLoading(true);
    setSwapResult(null);
    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromCurrency, toCurrency, fromAmount, destinationAddress: destination })
      });
      const data = await res.json();
      setSwapResult(data);
    } catch (err) {
      setSwapResult({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSwap} className="rounded-2xl p-4 bg-slate-800/20 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input value={fromAmount} onChange={e => setFromAmount(e.target.value)} className="p-2 rounded-md bg-slate-900/30" placeholder="Amount" inputMode="decimal" />
        <input value={destination} onChange={e => setDestination(e.target.value)} className="p-2 rounded-md bg-slate-900/30" placeholder="Destination address" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="p-2 rounded-md bg-slate-900/30">
          <option>ETH</option>
          <option>USDC</option>
          <option>DAI</option>
        </select>
        <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="p-2 rounded-md bg-slate-900/30">
          <option>USDT</option>
          <option>BTC</option>
          <option>BNB</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button disabled={loading} className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-sm">Preview / Create Swap</button>
      </div>

      {loading && <div className="text-sm text-slate-400">Creating swap...</div>}

      {swapResult && (
        <div className="bg-slate-900/30 p-3 rounded-md">
          {swapResult.error ? (
            <div className="text-rose-400">Error: {swapResult.error}</div>
          ) : (
            <>
              <div>Deposit to: <span className="font-mono break-all">{swapResult.depositAddress}</span></div>
              <div>Order ID: <span className="font-mono">{swapResult.providerOrderId}</span></div>
              <div className="text-sm text-slate-400 mt-2">Once deposit is detected your swap will progress.</div>
            </>
          )}
        </div>
      )}
    </form>
  );
}
