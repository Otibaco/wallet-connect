// app/page.js
"use client";

import ConnectButton from "@/components/ConnectButton";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center h-screen text-center">
      <motion.h1
        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to Crypto App
      </motion.h1>

      <motion.p
        className="mt-4 text-gray-400 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Connect your wallet to get started with balances, swaps, and transaction history.
      </motion.p>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ConnectButton />
      </motion.div>
    </section>
  );
}
