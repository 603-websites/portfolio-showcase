import { createClient } from "@/lib/supabase/server";
import { AlertCircle, BarChart3, Eye, Users, TrendingDown } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";

// Item 4
export const metadata: Metadata = {
  title: "Analytics — Dev Portal | Website Upgraders",
};

export default async function DevAnalyticsPage() {
  const supabase = await createClient();

  const { data: snapshots, error } = await supabase
    .from("analytics_snapshots")
    .select("*")
    .order("snapshot_date", { ascending: false })
    .limit(100);

  // Item 1 — error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">Failed to load analytics data.</p>
        <p className="text-text-dim text-sm">{error.message}</p>
        <a
          href="/dev/analytics"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </a>
      </div>
    );
  }

  const allSnapshots = snapshots || [];

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = allSnapshots.filter(
    (s) => new Date(s.snapshot_date) >= thirtyDaysAgo
  );

  const totalPageViews = recent.reduce((s, r) => s + (r.page_views || 0), 0);
  const totalVisitors = recent.reduce(
    (s, r) => s + (r.unique_visitors || 0),
    0
  );
  const avgBounce =
    recent.length > 0
      ? recent.reduce((s, r) => s + (r.bounce_rate || 0), 0) / recent.length
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-text-muted mt-1">
          Aggregated metrics across all client sites (last 30 days)
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm">Page Views</span>
            <Eye className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">
            {totalPageViews.toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm">Unique Visitors</span>
            <Users className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold">
            {totalVisitors.toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm">Avg Bounce Rate</span>
            <TrendingDown className="w-5 h-5 text-amber" />
          </div>
          <p className="text-3xl font-bold">{avgBounce.toFixed(1)}%</p>
        </div>
      </div>

      {/* Item 1 — empty state */}
      {allSnapshots.length === 0 ? (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <BarChart3 className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">
            No Analytics Data Yet
          </h3>
          <p className="text-text-dim text-sm max-w-md mx-auto">
            Analytics data will appear here once the daily sync runs and client
            sites start receiving traffic.
          </p>
        </div>
      ) : (
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Snapshots</h2>
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
                {allSnapshots.slice(0, 20).map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-dark-border last:border-0"
                  >
                    {/* Item 6 — local timezone date */}
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
