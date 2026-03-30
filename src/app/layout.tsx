import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "603 Websites | Managed Website Subscriptions",
  description:
    "Professional managed website subscriptions for small businesses in New England and beyond.",
  openGraph: {
    title: "603 Websites",
    description:
      "We build and manage fast, professional websites for small businesses.",
    siteName: "603 Websites",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
