// app/page.js
"use client";
import ConnectWallet from "./components/ConnectWallet";

export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl p-6 bg-slate-800/30">
        <h2 className="text-2xl font-bold mb-2">Welcome to Eriwa</h2>
        <p className="text-slate-300 mb-4">Simple, mobile-first, non-custodial crypto app. Connect wallet to continue.</p>
        <ConnectWallet />
      </section>
    </div>
  );
}
