// app/dashboard/page.js
import BalanceCard from "../../components/BalanceCard";
import TransactionTable from "../../components/TransactionTable";
import { cookies } from "next/headers";
import { verifyToken } from "../../utils/jwt";
import dbConnect from "../../lib/db";
import User from "../../models/User";
import Transaction from "../../models/Transaction";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const userData = token ? verifyToken(token) : null;
  if (!userData) {
    // For server component redirect to landing if not auth
    return (
      <div className="py-20">
        <p className="text-center">Not authenticated. Please <a href="/" className="underline">login</a>.</p>
      </div>
    );
  }

  await dbConnect();
  const user = await User.findOne({ walletAddress: userData.walletAddress }).lean();

  // fetch recent txs from DB
  const txs = await Transaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(10).lean();

  // Balances could be client-side via /api/balance; here we show skeleton cards
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-sm text-gray-300">{user.walletAddress}</p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <BalanceCard symbol="ETH" balance="—" />
        <BalanceCard symbol="BTC" balance="—" />
        <BalanceCard symbol="USDT" balance="—" />
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
        <TransactionTable txs={txs} />
      </section>
    </div>
  );
}
