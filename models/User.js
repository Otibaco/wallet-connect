// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, unique: true, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
