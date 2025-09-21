// app/layout.js
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata = {
  title: "Crypto App",
  description: "Web3 Auth with AppKit + MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen" cz-shortcut-listen="true">
        <WalletProvider>
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
