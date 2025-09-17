// components/TransactionTable.js
export default function TransactionTable({ txs = [] }) {
  if (!txs.length) {
    return <div className="p-4 bg-gray-800 rounded-lg">No transactions yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr className="text-left text-sm text-gray-400">
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">From → To</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((t) => (
            <tr key={t._id} className="odd:bg-gray-850 even:bg-gray-800">
              <td className="py-2 px-3 text-sm text-gray-300">{new Date(t.createdAt).toLocaleString()}</td>
              <td className="py-2 px-3 text-sm">{t.fromCoin} → {t.toCoin}</td>
              <td className="py-2 px-3 text-sm">{t.amountFrom} → {t.amountTo}</td>
              <td className="py-2 px-3 text-sm">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
