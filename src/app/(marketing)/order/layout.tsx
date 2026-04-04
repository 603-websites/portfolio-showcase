import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started | Choose Your Plan | Website Upgraders",
  description:
    "Start your managed website subscription. Choose from Starter, Growth, or Pro plans with professional design, hosting, and ongoing support.",
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
