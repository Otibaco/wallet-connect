// app/login/page.js
import ConnectWallet from "@/components/ConnectWallet";
import dynamic from "next/dynamic";


export default function LoginPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="container-card mt-6">
        <h2 className="text-xl font-semibold">Connect Wallet</h2>
        <p className="small-muted">Sign-in with MetaMask — your wallet is your account (no password).</p>
        <div className="mt-4">
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
