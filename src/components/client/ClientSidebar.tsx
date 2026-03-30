"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileEdit,
  ChevronDown,
  UtensilsCrossed,
  Clock,
  Megaphone,
  Phone,
  BarChart3,
  Calendar,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const contentItems = [
  { href: "/client/content/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/client/content/hours", label: "Hours", icon: Clock },
  { href: "/client/content/promotions", label: "Promotions", icon: Megaphone },
  { href: "/client/content/contact", label: "Contact Info", icon: Phone },
];

export default function ClientSidebar({
  client,
}: {
  client: { name: string; plan: string };
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(
    pathname.startsWith("/client/content")
  );

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const planColor =
    client.plan === "pro"
      ? "bg-violet/10 text-violet"
      : client.plan === "growth"
      ? "bg-success/10 text-success"
      : "bg-accent/10 text-accent";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-dark-border">
        <Link href="/" className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
            S&C
          </span>
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-text text-sm font-medium truncate">
            {client.name}
          </p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${planColor}`}
          >
            {client.plan}
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/client/dashboard"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            isActive("/client/dashboard")
              ? "bg-accent/10 text-accent"
              : "text-text-muted hover:text-text hover:bg-dark-lighter"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>

        {/* Content submenu */}
        <button
          onClick={() => setContentOpen(!contentOpen)}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            pathname.startsWith("/client/content")
              ? "bg-accent/10 text-accent"
              : "text-text-muted hover:text-text hover:bg-dark-lighter"
          }`}
        >
          <span className="flex items-center gap-3">
            <FileEdit className="w-5 h-5" /> Edit Content
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              contentOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {contentOpen && (
          <div className="pl-4 space-y-1">
            {contentItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive(item.href)
                    ? "text-accent bg-accent/5"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/client/analytics"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            isActive("/client/analytics")
              ? "bg-accent/10 text-accent"
              : "text-text-muted hover:text-text hover:bg-dark-lighter"
          }`}
        >
          <BarChart3 className="w-5 h-5" /> Analytics
        </Link>

        <Link
          href="/client/meetings"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            isActive("/client/meetings")
              ? "bg-accent/10 text-accent"
              : "text-text-muted hover:text-text hover:bg-dark-lighter"
          }`}
        >
          <Calendar className="w-5 h-5" /> Meetings
        </Link>

        <Link
          href="/client/billing"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            isActive("/client/billing")
              ? "bg-accent/10 text-accent"
              : "text-text-muted hover:text-text hover:bg-dark-lighter"
          }`}
        >
          <CreditCard className="w-5 h-5" /> Billing
        </Link>
      </nav>

      <div className="p-4 border-t border-dark-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-dim hover:text-error transition w-full"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-light border border-dark-border rounded-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-dark-light border-r border-dark-border z-40 transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>
    </>
  );
}
