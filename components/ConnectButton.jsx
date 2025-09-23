import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage(); // ✅ wagmi hook
  const appKit = useAppKit();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const authenticate = async () => {
      if (mounted && isConnected && address) {
        try {
          setLoading(true);

          // 1. Get nonce
          const { data: { nonce } } = await axios.get("/api/auth/nonce");

          // 2. User signs with wagmi (works for ALL wallets)
          const message = `Sign this message to login: ${nonce}`;
          const signature = await signMessageAsync({ message });

          // 3. Verify on backend
          await axios.post("/api/auth/verify", {
            address,
            signature,
            nonce,
          });

          console.log("✅ Authenticated successfully!");
          router.push("/dashboard");
        } catch (err) {
          console.error("❌ Auth failed", err);
          disconnect();
        } finally {
          setLoading(false);
        }
      }
    };
    authenticate();
  }, [mounted, isConnected, address, disconnect, router, signMessageAsync]);

  if (!mounted) return null;

  return (
    <button
      onClick={async () => {
        await disconnect(); // reset
        appKit.open();      // open AppKit modal
      }}
      disabled={loading}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:opacity-90 transition disabled:opacity-50"
    >
      {loading ? "Authenticating..." : "Connect Wallet"}
    </button>
  );
}
