// components/Navbar.js
"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ✅ icons
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Desktop Links */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              {process.env.NEXT_PUBLIC_APP_NAME || "CryptoNext"}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-4 ml-6">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/swap" className="hover:underline">Swap</Link>
            <Link href="/history" className="hover:underline">History</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
          </div>
        </div>

        {/* Right: Wallet + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ConnectWallet />
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-4 py-3 space-y-2 flex flex-col">
            <Link href="/dashboard" className="hover:underline" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link href="/swap" className="hover:underline" onClick={() => setMenuOpen(false)}>Swap</Link>
            <Link href="/history" className="hover:underline" onClick={() => setMenuOpen(false)}>History</Link>
            <Link href="/profile" className="hover:underline" onClick={() => setMenuOpen(false)}>Profile</Link>

            {/* ConnectWallet inside menu for mobile */}
            <div className="pt-3 border-t border-gray-700">
              <ConnectWallet />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
