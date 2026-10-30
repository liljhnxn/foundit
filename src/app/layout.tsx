import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FoundIt - Lost something? Find it here.",
  description: "A decentralized Web3 lost-and-found board on Botchain Testnet.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-charcoal-950 text-charcoal-100 min-h-screen antialiased selection:bg-purple-900 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

