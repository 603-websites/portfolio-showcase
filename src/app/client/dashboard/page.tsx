import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ExternalLink,
  UtensilsCrossed,
  BarChart3,
  Calendar,
  CreditCard,
  Eye,
  Users,
} from "lucide-react";

export const metadata = { title: "Client Dashboard | 603 Websites" };

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clientUser } = await supabase
    .from("client_users")
    .select(
      "clients(*, analytics_snapshots(page_views, unique_visitors, snapshot_date))"
    )
    .eq("user_id", user!.id)
    .single();

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

  // Last 30 days analytics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSnapshots =
    client?.analytics_snapshots?.filter(
      (s) => new Date(s.snapshot_date) >= thirtyDaysAgo
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

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {client?.name || "there"}
            </h1>
            <p className="text-text-muted mt-1">{client?.business_name}</p>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${planColor}`}
              >
                {client?.plan || "starter"} plan
              </span>
              <span
                className={`text-xs font-medium ${
                  client?.status === "active" ? "text-success" : "text-error"
                }`}
              >
                {client?.status}
              </span>
            </div>
          </div>
          {client?.website_url && (
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
          <p className="text-xl font-bold">
            {client?.next_billing_date || "—"}
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
