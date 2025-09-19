// app/components/ConnectWallet.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";

/*
  Behavior:
  - open AppKit modal to connect wallets
  - when connected, automatically perform SIWE:
      GET /api/auth/nonce -> build canonical SIWE message -> sign -> POST /api/auth/verify
  - if verify OK -> redirect to /dashboard
*/

export default function ConnectWallet() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { provider } = useAppKitProvider();
  const router = useRouter();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [didSignIn, setDidSignIn] = useState(false);

  useEffect(() => {
    // If connected and not yet signed-in via SIWE in this session, attempt sign-in
    if (isConnected && address && provider && !didSignIn) {
      void doSiweSignIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, provider]);

  async function connect() {
    setError(null);
    try {
      await open();
    } catch (err) {
      console.error("AppKit open error:", err);
      setError("Failed to open wallet modal");
    }
  }

  async function doSiweSignIn() {
    setBusy(true);
    setError(null);
    try {
      // 1) Get signer and chain
      const browserProvider = new ethers.BrowserProvider(provider);
      const signer = await browserProvider.getSigner();
      const walletAddress = (await signer.getAddress()).toLowerCase();
      const network = await browserProvider.getNetwork();
      const chainId = network.chainId || 1;

      // 2) Get nonce from server
      const nonceRes = await fetch("/api/auth/nonce");
      if (!nonceRes.ok) throw new Error("Failed to fetch nonce");
      const { nonce } = await nonceRes.json();

      // 3) Build canonical SIWE message with siwe lib
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = "Sign in to Eriwa — Non-custodial crypto app.";
      const siweMessage = new SiweMessage({
        domain,
        address: walletAddress,
        statement,
        uri: origin,
        version: "1",
        chainId: chainId,
        nonce,
        issuedAt: new Date().toISOString()
      });

      const messageToSign = siweMessage.prepareMessage();

      // 4) Ask wallet to sign
      const signature = await signer.signMessage(messageToSign);

      // 5) Verify server-side
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSign, signature })
      });

      const verifyJson = await verifyRes.json();

      if (!verifyRes.ok) {
        console.error("SIWE verify failed:", verifyJson);
        throw new Error(verifyJson.error || "SIWE verification failed");
      }

      // mark we signed in (prevents double-sign on re-renders)
      setDidSignIn(true);

      // redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("SIWE flow error:", err);
      setError(err?.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
  try {
    // If provider supports disconnect (WalletConnect does)
    if (provider?.disconnect) await provider.disconnect();
    
    // Call logout API to clear JWT cookie
    await fetch("/api/auth/logout", { method: "POST" });

    // Reload page to reset client state
    window.location.href = "/";
  } catch (err) {
    console.error("disconnect error", err);
  }
}


  return (
    <div>
      {!isConnected ? (
        <button onClick={connect} className="bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 rounded-full text-white font-semibold">
          {busy ? "Working..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-sm bg-slate-700 px-3 py-2 rounded-full font-mono">{address}</div>
          <button onClick={doSiweSignIn} disabled={busy} className="px-3 py-2 rounded-full bg-emerald-600 text-sm text-white">
            {busy ? "Signing..." : "Sign-In"}
          </button>
          <button onClick={disconnect} className="px-3 py-2 rounded-full bg-slate-600 text-sm text-white">Disconnect</button>
        </div>
      )}

      {error && <div className="mt-2 text-sm text-rose-400">{error}</div>}
    </div>
  );
}
