// models/Swap.js
import mongoose from "mongoose";

const SwapSchema = new mongoose.Schema({
  userWallet: { type: String, required: true, index: true },
  fromCurrency: String,
  toCurrency: String,
  fromAmount: String,
  expectedToAmount: String,
  depositAddress: String,
  providerOrderId: String,
  destinationAddress: String,
  status: { type: String, default: "created" },
  providerTxHash: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SwapSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Swap || mongoose.model("Swap", SwapSchema);
