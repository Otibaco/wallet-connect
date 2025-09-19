// app/swap/page.js
"use client";
import SwapForm from "../components/SwapForm";

export default function SwapPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-slate-800/30">
        <h2 className="text-lg font-semibold">Swap</h2>
        <p className="text-slate-400 text-sm">Create a new swap (StealthEX). If provider keys are missing, a stub deposit address will be returned.</p>
      </div>

      <SwapForm />
    </div>
  );
}
