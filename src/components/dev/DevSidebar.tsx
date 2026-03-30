"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  SquareCheckBig,
  DollarSign,
  Calendar,
  ChartNoAxesColumn,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dev/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dev/clients", label: "Clients", icon: Users },
  { href: "/dev/tasks", label: "Tasks", icon: SquareCheckBig },
  { href: "/dev/revenue", label: "Revenue", icon: DollarSign },
  { href: "/dev/calendar", label: "Calendar", icon: Calendar },
  { href: "/dev/analytics", label: "Analytics", icon: ChartNoAxesColumn },
];

export default function DevSidebar({
  user,
}: {
  user: { email: string; full_name?: string };
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-dark-border">
        <Link href="/" className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
            S&C
          </span>
        </Link>
        <p className="text-text-dim text-xs mt-1">Dev Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text hover:bg-dark-lighter"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-text truncate">
              {user.full_name || user.email}
            </p>
            <p className="text-xs text-text-dim truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-text-dim hover:text-error transition rounded-lg"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-light border border-dark-border rounded-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
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
