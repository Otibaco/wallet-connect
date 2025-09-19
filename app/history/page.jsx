// app/history/page.js
"use client";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    fetch("/api/swaps")
      .then(r => r.json())
      .then(d => setSwaps(d.swaps || []))
      .catch(() => setSwaps([]));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
      <div className="space-y-3">
        {swaps.length === 0 && <div className="text-slate-400">No swaps yet.</div>}
        {swaps.map(s => (
          <div key={s._id} className="p-3 bg-slate-800/20 rounded-lg">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{s.fromAmount} {s.fromCurrency} → {s.toCurrency}</div>
                <div className="text-xs text-slate-400">To: {s.destinationAddress}</div>
              </div>
              <div className="text-sm text-slate-300">{s.status}</div>
            </div>
            <div className="text-xs text-slate-500 mt-2">Order: {s.providerOrderId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
