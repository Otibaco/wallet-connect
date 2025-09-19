// app/components/TransactionList.jsx
"use client";
import { useEffect, useState } from "react";

export default function TransactionList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/swaps")
      .then(r => r.json())
      .then(d => setList(d.swaps || []))
      .catch(() => setList([]));
  }, []);

  return (
    <div className="rounded-2xl p-4 bg-slate-800/20">
      <h3 className="font-semibold mb-3">Recent Transactions</h3>
      {list.length === 0 && <div className="text-slate-400 text-sm">No recent swaps.</div>}
      <div className="flex flex-col gap-2">
        {list.slice(0, 6).map(s => (
          <div key={s._id} className="p-2 bg-slate-900/40 rounded-md">
            <div className="flex justify-between">
              <div className="text-sm font-medium">{s.fromAmount} {s.fromCurrency} → {s.toCurrency}</div>
              <div className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-xs text-slate-400 mt-1">Status: {s.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
