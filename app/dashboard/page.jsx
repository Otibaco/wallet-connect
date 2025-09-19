"use client";
import BalanceList from "@/components/BalanceList";
import TransactionList from "@/components/TransactionList";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    // fetch the wallet from backend session (after login/register)
    fetch("/api/session")
      .then(r => r.json())
      .then(d => {
        if (d.walletAddress) setWallet(d.walletAddress);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-4 bg-slate-800/30">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-slate-400 text-sm">
          Welcome back{wallet ? `, ${wallet}` : ""}.
        </p>
      </div>

      <BalanceList />

      <TransactionList />
    </div>
  );
}
