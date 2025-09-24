// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    walletAddress: { type: String, unique: true, required: true },
    nonce: { type: String }, // ✅ add nonce field
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
