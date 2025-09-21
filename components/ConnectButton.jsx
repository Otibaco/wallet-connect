"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"; // ✅ correct import
import axios from "axios";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const appKit = useAppKit();
  const { account } = useAppKitAccount();

  // ✅ Hydration fix: don’t render until client is mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const authenticate = async () => {
      if (mounted && isConnected && address) {
        try {
          // Step 1: Get nonce from backend
          const {
            data: { nonce },
          } = await axios.get("/api/auth/nonce");

          // Step 2: Ask user to sign the nonce
          const message = `Sign this message to login: ${nonce}`;
          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [message, address],
          });

          // Step 3: Verify on backend
          await axios.post("/api/auth/verify", {
            address,
            signature,
            message,
          });

          console.log("✅ Authenticated successfully!");
        } catch (err) {
          console.error("❌ Auth failed", err);
        }
      }
    };

    authenticate();
  }, [mounted, isConnected, address]);

  // 🚀 Don’t render anything until client mounted (prevents hydration mismatch)
  if (!mounted) return null;

  if (!isConnected) {
    return (
      <button
        onClick={() => appKit.open()} // ✅ opens AppKit modal
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-white">
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Disconnect
      </button>
    </div>
  );
}
