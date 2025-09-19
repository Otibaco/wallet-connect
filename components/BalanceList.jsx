// app/components/BalanceList.jsx
"use client";
import { useEffect, useState } from "react";

export default function BalanceList() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/session")
      .then(r => r.json())
      .then(d => {
        const addr = d.walletAddress;
        if (addr) {
          setLoading(true);
          fetch(`/api/balances?address=${addr}&chain=eth`)
            .then(r => r.json())
            .then(j => setBalances(j.result || []))
            .catch(() => setBalances([]))
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-2xl p-4 bg-slate-800/20">
      <h3 className="font-semibold mb-3">Balances</h3>
      {loading && <div className="text-sm text-slate-400">Loading balances...</div>}
      <div className="space-y-2">
        {balances.length === 0 && <div className="text-slate-400 text-sm">No tokens found (or not connected).</div>}
        {balances.map((b, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-slate-900/40 rounded-md">
            <div>
              <div className="font-medium">{b.symbol || b.token_symbol || "TOKEN"}</div>
              <div className="text-xs text-slate-400">{b.name || b.token_name || b.token_address}</div>
            </div>
            <div className="text-sm">{formatBalance(b.balance, b.decimals)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatBalance(balance, decimals = 18) {
  try {
    const bn = BigInt(balance.toString());
    const denom = BigInt(10) ** BigInt(decimals);
    const whole = bn / denom;
    const frac = bn % denom;
    const fracStr = frac === BigInt(0) ? "" : `.${String(frac).padStart(Number(decimals), "0").slice(0, 4)}`;
    return `${whole}${fracStr}`;
  } catch {
    return balance;
  }
}
