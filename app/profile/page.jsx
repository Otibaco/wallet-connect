// app/profile/page.js
import { cookies } from "next/headers";
import { verifyToken } from "../../utils/jwt";
import dbConnect from "../../lib/db";
import User from "../../models/User";

export default async function ProfilePage() {
  const token = cookies().get("token")?.value;
  const userData = token ? verifyToken(token) : null;
  if (!userData) return <div className="py-12 text-center">Please log in</div>;

  await dbConnect();
  const user = await User.findOne({ walletAddress: userData.walletAddress }).lean();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="p-4 bg-gray-800 rounded-xl">
        <p><strong>Wallet:</strong> {user.walletAddress}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      </div>
      <div className="mt-4">
        <form method="post" action="/api/auth/profile">
          {/* For brevity, this is static; you can add API route to update profile */}
          <button type="button" className="mt-4 px-4 py-2 rounded-full border">Edit profile (TODO)</button>
        </form>
      </div>
    </div>
  );
}
