// app/history/page.js
import dbConnect from "../../lib/db";
import { verifyToken } from "../../utils/jwt";
import { cookies } from "next/headers";
import User from "../../models/User";
import Transaction from "../../models/Transaction";
import TransactionTable from "../../components/TransactionTable";

export default async function HistoryPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const userData = token ? verifyToken(token) : null;
  if (!userData) {
    return <div className="py-20 text-center">Not authenticated</div>;
  }

  await dbConnect();
  const user = await User.findOne({ walletAddress: userData.walletAddress }).lean();
  const txs = await Transaction.find({ user: user._id }).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <TransactionTable txs={txs} />
    </div>
  );
}
