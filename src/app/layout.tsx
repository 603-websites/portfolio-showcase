import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// Validate required environment variables at startup (Item 10)
import "@/lib/env";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Upgraders | Managed Website Subscriptions",
  description:
    "Professional managed website subscriptions for small businesses in New England and beyond.",
  openGraph: {
    title: "Website Upgraders",
    description:
      "We build and manage fast, professional websites for small businesses.",
    siteName: "Website Upgraders",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        {/* Global toast notifications (Item 5) */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e1e2e",
              color: "#e2e2f0",
              border: "1px solid #2e2e3e",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#1e1e2e" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#1e1e2e" },
            },
          }}
        />
      </body>
    </html>
  );
}
