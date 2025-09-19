// models/Nonce.js
import mongoose from "mongoose";

const NonceSchema = new mongoose.Schema({
  nonce: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

export default mongoose.models.Nonce || mongoose.model("Nonce", NonceSchema);
