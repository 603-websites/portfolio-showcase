import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertCircle, ExternalLink, UtensilsCrossed, BarChart3, Calendar, CreditCard, Eye, Users, LayoutDashboard } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";

// Item 4 — descriptive tab title
export const metadata: Metadata = {
  title: "Dashboard | Client Portal | Website Upgraders",
};

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // Item 2 — surface auth errors; SessionExpiredModal is wired in the layout
  // (server components can't use hooks, so we redirect instead)
  if (authError || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-error mx-auto" />
          <p className="text-text-muted">Unable to verify your session.</p>
          <Link href="/login" className="text-accent hover:underline text-sm">
            Sign in again
          </Link>
        </div>
      </div>
    );
  }

  const { data: clientUser, error: clientError } = await supabase
    .from("client_users")
    .select(
      "clients(*, analytics_snapshots(page_views, unique_visitors, snapshot_date))"
    )
    .eq("user_id", user.id)
    .single();

  // Item 1 — error state
  if (clientError && clientError.code !== "PGRST116") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">Failed to load your dashboard.</p>
        <p className="text-text-dim text-sm">{clientError.message}</p>
        <a
          href="/client/dashboard"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </a>
      </div>
    );
  }

  const client = clientUser?.clients as unknown as {
    name: string;
    business_name: string;
    plan: string;
    website_url: string;
    status: string;
    next_billing_date: string | null;
    analytics_snapshots: Array<{
      page_views: number;
      unique_visitors: number;
      snapshot_date: string;
    }>;
  } | null;

  // Last 30 days analytics.
  // snapshot_date is a date-only string (YYYY-MM-DD). Parsing it with
  // new Date() treats it as UTC midnight, which can fall before a local-time
  // threshold and wrongly exclude data. We compare ISO date strings directly
  // to avoid any timezone shift.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const recentSnapshots =
    client?.analytics_snapshots?.filter(
      (s) => s.snapshot_date >= thirtyDaysAgoStr
    ) || [];
  const totalViews = recentSnapshots.reduce(
    (s, r) => s + (r.page_views || 0),
    0
  );
  const totalVisitors = recentSnapshots.reduce(
    (s, r) => s + (r.unique_visitors || 0),
    0
  );

  const planColor =
    client?.plan === "pro"
      ? "bg-violet/10 text-violet"
      : client?.plan === "growth"
      ? "bg-success/10 text-success"
      : "bg-accent/10 text-accent";

  const quickActions = [
    {
      label: "Edit Content",
      href: "/client/content/menu",
      icon: UtensilsCrossed,
    },
    { label: "View Analytics", href: "/client/analytics", icon: BarChart3 },
    { label: "Book Meeting", href: "/client/meetings", icon: Calendar },
    { label: "View Billing", href: "/client/billing", icon: CreditCard },
  ];

  // Item 1 — empty state (no client record yet)
  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <LayoutDashboard className="w-12 h-12 text-text-dim" />
        <h2 className="text-lg font-semibold text-text">
          Complete your account setup
        </h2>
        <p className="text-text-muted text-sm max-w-sm">
          We need a few details to get your dashboard ready.
        </p>
        <Link
          href="/onboarding"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-2.5 text-sm font-medium transition"
        >
          Complete Setup
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {client.name}
            </h1>
            <p className="text-text-muted mt-1">{client.business_name}</p>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${planColor}`}
              >
                {client.plan} plan
              </span>
              <span
                className={`text-xs font-medium ${
                  client.status === "active" ? "text-success" : "text-error"
                }`}
              >
                {client.status}
              </span>
            </div>
          </div>
          {client.website_url && (
            <a
              href={client.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent hover:underline text-sm"
            >
              <ExternalLink className="w-4 h-4" /> View Your Site
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">Page Views (30d)</span>
            <Eye className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">Visitors (30d)</span>
            <Users className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold">
            {totalVisitors.toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">Next Billing</span>
            <CreditCard className="w-5 h-5 text-violet" />
          </div>
          {/* Item 6 — format date in local timezone */}
          <p className="text-xl font-bold">
            {client.next_billing_date
              ? formatDate(client.next_billing_date)
              : "—"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-dark-light border border-dark-border rounded-xl p-5 hover:border-accent/50 transition group"
            >
              <action.icon className="w-8 h-8 text-accent mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-text font-medium">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
