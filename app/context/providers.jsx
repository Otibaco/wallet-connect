// app/providers.jsx
"use client";
import React from "react";
import { createAppKit, AppKitProvider } from "@reown/appkit/react";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const { chains, publicClient } = configureChains([mainnet], [publicProvider()]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [], // AppKit will inject connectors via AppKitProvider
  publicClient
});

createAppKit({
  projectId,
  chains,
  metadata: {
    name: "Eriwa",
    description: "Non-custodial crypto app",
    url: "http://localhost:3000",
    icons: ["https://walletconnect.com/_next/static/media/logo_mark.4c5d2851.svg"]
  }
});

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>
        <AppKitProvider>{children}</AppKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
