import { createClient } from "@/lib/supabase/server";
import { AlertCircle, BarChart3, Eye, Users } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";

// Item 4
export const metadata: Metadata = {
  title: "Analytics — Client Portal | Website Upgraders",
};

export default async function ClientAnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cu, error: cuError } = await supabase
    .from("client_users")
    .select("client_id")
    .eq("user_id", user!.id)
    .single();

  // Item 1 — error state
  if (cuError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">Failed to load analytics.</p>
        <a
          href="/client/analytics"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </a>
      </div>
    );
  }

  const { data: snapshots, error: snapshotsError } = await supabase
    .from("analytics_snapshots")
    .select("*")
    .eq("client_id", cu?.client_id || "")
    .order("snapshot_date", { ascending: false })
    .limit(30);

  if (snapshotsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">Failed to load analytics data.</p>
        <p className="text-text-dim text-sm">{snapshotsError.message}</p>
        <a
          href="/client/analytics"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </a>
      </div>
    );
  }

  const data = snapshots || [];
  const totalViews = data.reduce((s, d) => s + (d.page_views || 0), 0);
  const totalVisitors = data.reduce((s, d) => s + (d.unique_visitors || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-text-muted mt-1">Last 30 days performance</p>
      </div>

      {/* Item 1 — skeleton loaders replaced with real content; summary cards always show */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">Total Page Views</span>
            <Eye className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-text-muted text-sm">Unique Visitors</span>
            <Users className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
        </div>
      </div>

      {/* Item 1 — empty state */}
      {data.length === 0 ? (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <BarChart3 className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">No Analytics Yet</h3>
          <p className="text-text-dim text-sm max-w-sm mx-auto">
            Analytics data will appear here once your site starts receiving
            traffic.
          </p>
        </div>
      ) : (
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border text-text-muted">
                  <th className="text-left pb-3">Date</th>
                  <th className="text-left pb-3">Page Views</th>
                  <th className="text-left pb-3">Visitors</th>
                  <th className="text-left pb-3">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.map((s) => (
                  <tr key={s.id} className="border-b border-dark-border last:border-0">
                    {/* Item 6 — local timezone date formatting */}
                    <td className="py-2 text-text">{formatDate(s.snapshot_date)}</td>
                    <td className="py-2 text-text">{s.page_views.toLocaleString()}</td>
                    <td className="py-2 text-text">{s.unique_visitors.toLocaleString()}</td>
                    <td className="py-2 text-text">{s.bounce_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
