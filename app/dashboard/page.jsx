// app/dashboard/page.js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold">
        Welcome back,{" "}
        <span className="text-purple-400">
          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Your Wallet</h3>
          <p className="text-gray-300 break-all">{user.walletAddress}</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <p className="text-gray-400">Coming soon...</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Balances</h3>
          <p className="text-gray-400">Coming soon (Moralis API)...</p>
        </div>
      </div>
    </motion.div>
  );
}
