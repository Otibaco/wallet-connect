// app/profile/page.js
"use client";

export default function ProfilePage() {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/";
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-slate-800/30">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-slate-400 text-sm">Edit profile metadata (stored minimal).</p>
      </div>

      <div className="flex gap-3">
        <button onClick={handleLogout} className="rounded-full bg-red-600 px-4 py-2 text-sm">Logout</button>
      </div>
    </div>
  );
}
