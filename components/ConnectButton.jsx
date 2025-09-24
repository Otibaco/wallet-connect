"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import axios from "axios";
import { toast } from "sonner";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const appKit = useAppKit();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  // 🔐 Authentication flow
  useEffect(() => {
    const authenticate = async () => {
      if (mounted && isConnected && address) {
        try {
          setLoading(true);

          // 1️⃣ Get nonce from backend
          const { data } = await axios.get(`/api/auth/nonce?address=${address}`);
          const { nonce } = data;

          // 2️⃣ Sign nonce
          const message = `Sign this message to login:\n${nonce}`;
          const signature = await signMessageAsync({ message });

          // 3️⃣ Verify backend
          await axios.post("/api/auth/verify", {
            address,
            signature,
            message,
          });

          toast.success("✅ Authenticated successfully");
        } catch (err) {
          console.error("❌ Auth failed:", err);
          toast.error("❌ Auth failed");
          disconnect();
        } finally {
          setLoading(false);
        }
      }
    };
    authenticate();
  }, [mounted, isConnected, address, disconnect, signMessageAsync]);

  if (!mounted) return null;

  return (
    <button
      onClick={async () => {
        if (isConnected) {
          // ✅ Open wallet modal if already connected
          appKit.open();
        } else {
          // ✅ Reset then show modal
          await disconnect();
          appKit.open();
        }
      }}
      disabled={loading}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
    >
      {loading
        ? "Authenticating..."
        : isConnected
        ? "Open Wallet"
        : "Connect Wallet"}
    </button>
  );
}
