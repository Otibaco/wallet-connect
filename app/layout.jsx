import "./globals.css";
// app/layout.js
import Providers from "./providers";

export const metadata = { title: "Eriwa", description: "Non-custodial crypto app" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-slate-900 to-black text-slate-100 min-h-screen">
        <div className="max-w-xl mx-auto px-4 py-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Eriwa</h1>
            <nav className="space-x-3 text-sm">
              <a href="/" className="hover:underline">Home</a>
              <a href="/dashboard" className="hover:underline">Dashboard</a>
              <a href="/swap" className="hover:underline">Swap</a>
              <a href="/history" className="hover:underline">History</a>
              <a href="/profile" className="hover:underline">Profile</a>
            </nav>
          </header>

          <Providers>{children}</Providers>

          <footer className="mt-10 text-center text-xs text-slate-500">
            Non-custodial — your keys, your funds.
          </footer>
        </div>
      </body>
    </html>
  );
}
