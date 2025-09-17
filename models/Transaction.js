// models/Transaction.js
import mongoose from "mongoose";

const TxSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fromCoin: String,
    toCoin: String,
    amountFrom: Number,
    amountTo: Number,
    receiveAddress: String,
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    externalId: String,
    metadata: Object
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", TxSchema);
