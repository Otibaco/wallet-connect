// app/api/session/route.js
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const token = request.cookies.get("eriwa_jwt")?.value;
    if (!token) return new Response(JSON.stringify({}), { status: 200 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(JSON.stringify({ walletAddress: decoded.walletAddress }), { status: 200 });
  } catch (err) {
    // invalid token or expired
    return new Response(JSON.stringify({}), { status: 200 });
  }
}
