// app/transactions/page.js
"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch("/api/swaps", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => setRows(j || []))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
      <div className="container-card">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[rgba(255,255,255,0.04)]">
              <th className="py-2">From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-b border-[rgba(255,255,255,0.02)]">
                <td className="py-2">{r.fromCurrency}</td>
                <td>{r.toCurrency}</td>
                <td>{r.fromAmount}</td>
                <td>{r.status}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="small-muted mt-4">No swaps yet.</div>}
      </div>
    </div>
  );
}
