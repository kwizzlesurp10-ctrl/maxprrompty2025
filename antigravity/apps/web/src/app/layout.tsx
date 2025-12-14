import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Google Antigravity",
  description: "Planet-scale spatial runtime"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-black text-white">
      <body className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
