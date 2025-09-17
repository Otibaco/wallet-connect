// components/ConnectWallet.js
"use client";
import { useState } from "react";
import axios from "axios";

export default function ConnectWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  async function connect() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setWallet(address);

      // Request nonce from server
      const nonceRes = await axios.get(`/api/auth/nonce?wallet=${address}`);
      const { message } = nonceRes.data;

      // Ask user to sign message
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address]
      });

      // Verify on server, get JWT cookie set
      const verifyRes = await axios.post("/api/auth/verify", { address, signature }, { withCredentials: true });

      if (verifyRes.data?.ok) {
        // server should set cookie; we can reload or just continue
        window.location.href = "/dashboard";
      } else {
        alert("Auth failed");
      }
    } catch (err) {
      console.error(err);
      alert(err?.message || "Error connecting wallet");
    } finally {
      setLoading(false);
    }
  }

  function shortAddr(a){
    if(!a) return "";
    return a.slice(0,6)+"..."+a.slice(-4);
  }

  return (
    <div>
      {!wallet ? (
        <button
          onClick={connect}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transform transition"
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex gap-2 items-center">
          <span className="text-sm bg-gray-800 px-3 py-1 rounded-full">{shortAddr(wallet)}</span>
          <button
            onClick={() => {
              // clear cookie via API
              axios.post("/api/auth/logout").then(()=> window.location.reload());
            }}
            className="px-3 py-1 rounded-full border border-gray-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
