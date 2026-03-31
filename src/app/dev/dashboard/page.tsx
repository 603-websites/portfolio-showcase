import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  DollarSign,
  Users,
  SquareCheckBig,
  TrendingUp,
  Activity,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import RevenueChart from "@/components/dev/RevenueChart";
import { formatDatetime } from "@/lib/format";

// Item 4
export const metadata: Metadata = {
  title: "Dashboard — Dev Portal | Website Upgraders",
};

export default async function DevDashboard() {
  const supabase = await createClient();

  const [clientsRes, tasksRes, invoicesRes, activityRes] = await Promise.all([
    supabase
      .from("clients")
      .select("id, name, plan, status, monthly_revenue, website_url"),
    supabase.from("tasks").select("id, title, status, priority, due_date, client_id"),
    supabase
      .from("invoices")
      .select("amount_cents, invoice_date")
      .eq("status", "paid")
      .order("invoice_date"),
    supabase
      .from("activity_log")
      .select("id, action, entity_type, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Item 1 — error state (any critical fetch failure)
  if (clientsRes.error || tasksRes.error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">Failed to load dashboard data.</p>
        <p className="text-text-dim text-sm">
          {clientsRes.error?.message || tasksRes.error?.message}
        </p>
        <a
          href="/dev/dashboard"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </a>
      </div>
    );
  }

  const clients = clientsRes.data || [];
  const tasks = tasksRes.data || [];
  const invoices = invoicesRes.data || [];
  const activities = activityRes.data || [];

  const activeClients = clients.filter((c) => c.status === "active");
  const mrr = activeClients.reduce((sum, c) => sum + (c.monthly_revenue || 0), 0);
  const openTasks = tasks.filter((t) => t.status !== "done").length;

  const kpis = [
    {
      label: "Monthly Revenue",
      value: `$${mrr.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
    },
    {
      label: "Active Clients",
      value: activeClients.length.toString(),
      icon: Users,
      color: "text-accent",
    },
    {
      label: "Open Tasks",
      value: openTasks.toString(),
      icon: SquareCheckBig,
      color: "text-amber",
    },
    {
      label: "ARR",
      value: `$${(mrr * 12).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-violet",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dev Dashboard</h1>
        <p className="text-text-muted mt-1">Overview of your business</p>
      </div>

      {/* KPI Cards */}
      {/* Item 7 — single column on mobile */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-dark-light border border-dark-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-muted text-sm">{kpi.label}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-3xl font-bold text-text">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <DollarSign className="w-10 h-10 text-text-dim" />
            <p className="text-text-dim text-sm">
              No paid invoices yet. Revenue will appear here once invoices are
              collected.
            </p>
          </div>
        ) : (
          <RevenueChart invoices={invoices} />
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <Activity className="w-8 h-8 text-text-dim" />
              <p className="text-text-dim text-sm">No activity yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 text-sm border-b border-dark-border pb-3 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                  <div>
                    <p className="text-text">{a.action}</p>
                    {/* Item 6 — local timezone */}
                    <p className="text-text-dim text-xs">
                      {a.entity_type} &middot;{" "}
                      {formatDatetime(a.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clients Table */}
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Clients</h2>
            <Link
              href="/dev/clients"
              className="text-accent text-sm hover:underline"
            >
              View All
            </Link>
          </div>
          {clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <Users className="w-8 h-8 text-text-dim" />
              <p className="text-text-dim text-sm">
                No clients yet. Add your first client to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={`/dev/clients/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-lighter transition"
                >
                  <div>
                    <p className="text-text font-medium">{c.name}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        c.plan === "pro"
                          ? "bg-violet/10 text-violet"
                          : c.plan === "growth"
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {c.plan}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-text font-medium">
                      ${c.monthly_revenue || 0}/mo
                    </p>
                    <span
                      className={`text-xs ${
                        c.status === "active" ? "text-success" : "text-error"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
