import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecondBrain",
  description: "Private AI memory workspace built natively on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0c0c12] font-sans">{children}</body>
    </html>
  );
}
