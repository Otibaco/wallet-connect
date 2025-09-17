// components/BalanceCard.js
"use client";
import { motion } from "framer-motion";

export default function BalanceCard({ symbol = "ETH", balance = "0.0" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">Balance</div>
          <div className="text-xl font-bold">{balance}</div>
        </div>
        <div className="text-2xl font-semibold">{symbol}</div>
      </div>
    </motion.div>
  );
}
