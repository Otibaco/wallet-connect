// components/Navbar.js
"use client";
import Link from "next/link";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              {process.env.NEXT_PUBLIC_APP_NAME || "CryptoNext"}
            </span>
          </Link>
          <div className="hidden md:flex gap-2">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/swap" className="hover:underline">Swap</Link>
            <Link href="/history" className="hover:underline">History</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
          </div>
        </div>

        <div>
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
