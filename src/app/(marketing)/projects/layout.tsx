import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Portfolio | Websites We Have Built | Website Upgraders",
  description:
    "See real websites we have built and manage for small businesses. Portfolio sites, business websites, and SaaS applications.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
