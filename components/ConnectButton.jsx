"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const appKit = useAppKit();
  const router = useRouter();

  // ✅ Hydration fix
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => setMounted(true), []);

  // 🔥 Authentication flow
  useEffect(() => {
    const authenticate = async () => {
      if (mounted && isConnected && address) {
        try {
          setLoading(true);

          // Step 1: get nonce
          const { data: { nonce } } = await axios.get("/api/auth/nonce");

          // Step 2: sign nonce
          const message = `Sign this message to login: ${nonce}`;
          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [message, address],
          });

          // Step 3: verify + save user
          await axios.post("/api/auth/verify", {
            address,
            signature,
            message,
          });

          console.log("✅ Authenticated successfully!");
          router.push("/dashboard"); // 🚀 redirect after auth
        } catch (err) {
          console.error("❌ Auth failed", err);
          disconnect(); // reset state if auth fails
        } finally {
          setLoading(false);
        }
      }
    };
    authenticate();
  }, [mounted, isConnected, address, disconnect, router]);

  // 🚀 Don’t render until mounted
  if (!mounted) return null;

  return (
    <button
      onClick={async () => {
        await disconnect(); // 🔥 clear old session so modal always shows
        appKit.open();      // open modal manually
      }}
      disabled={loading}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
    >
      {loading ? "Authenticating..." : "Connect Wallet"}
    </button>
  );
}
