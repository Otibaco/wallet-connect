"use client";
import { createAppKit, AppKitProvider } from "@reown/appkit/react";
import { WagmiProvider, createConfig } from "wagmi";
import { mainnet } from "viem/chains";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 1. Create wagmi config with viem transports
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

// 2. Create query client (react-query)
const queryClient = new QueryClient();

// 3. Project ID from Reown dashboard (in .env.local)
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  console.error("❌ NEXT_PUBLIC_PROJECT_ID is missing in .env.local");
}

// 4. Metadata for wallet connection modal
const metadata = {
  name: "Eriwa App",
  description: "Non-custodial crypto app",
  // url: "http://localhost:3000", update in dev
  url: "https://wallet-connect-vert-seven.vercel.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 5. Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet],
  projectId,
  metadata,
});

// 6. Initialize AppKit with wagmi adapter
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet],
  projectId,
  metadata,
});

// 7. Wrap providers
export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider
          adapters={[wagmiAdapter]}
          projectId={projectId}
          metadata={metadata}
        >{children}</AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
