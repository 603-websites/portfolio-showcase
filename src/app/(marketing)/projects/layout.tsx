import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects | Website Upgraders",
  description:
    "Browse websites we have built and manage for small businesses. Portfolio sites, SaaS apps, and more.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
