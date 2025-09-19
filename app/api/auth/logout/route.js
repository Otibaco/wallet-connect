// app/api/auth/logout/route.js
export async function POST() {
  // Clear cookie
  const cookieParts = [
    "eriwa_jwt=deleted",
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0" // expire immediately
  ];
  if (process.env.NODE_ENV === "production") cookieParts.push("Secure");
  if (process.env.COOKIE_DOMAIN) cookieParts.push(`Domain=${process.env.COOKIE_DOMAIN}`);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieParts.join("; ")
    }
  });
}
