import type { Metadata } from "next";
import GradientBackground from "@/components/shared/GradientBackground";
import Navbar from "@/components/shared/Navbar";

// Item 4 — base title for the auth group; individual pages override as needed
export const metadata: Metadata = {
  title: "Sign In — 603 Websites",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GradientBackground />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        {children}
      </div>
    </>
  );
}
