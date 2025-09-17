// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    walletAddress: { type: String, required: true, unique: true, index: true },
    nonce: { type: String }, // for SIWE
    // name: { type: String, default: "" },
    // email: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
