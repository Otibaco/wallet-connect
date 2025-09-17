// app/page.js
import ConnectWallet from "../components/ConnectWallet";

export default function Home() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-4xl font-bold">Welcome to {process.env.NEXT_PUBLIC_APP_NAME}</h1>
      <p className="max-w-xl">A minimal crypto web app using MetaMask auth, MongoDB, Moralis balances and StealthEX swap integration.</p>
      <ConnectWallet />
    </div>
  );
}
