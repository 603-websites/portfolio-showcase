import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/analytics/sync
 * Aggregates analytics_events into analytics_snapshots for each active client.
 * Call daily via cron (e.g., Vercel Cron or external scheduler).
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedKey = process.env.CRON_SECRET;
    if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Get all active clients
    const { data: clients } = await supabase
      .from("clients")
      .select("id")
      .eq("status", "active");

    if (!clients?.length) {
      return NextResponse.json({ message: "No active clients" });
    }

    const today = new Date().toISOString().split("T")[0];
    let synced = 0;

    for (const client of clients) {
      // Count page views for today
      const { count: pageViews } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("client_id", client.id)
        .eq("event_date", today)
        .eq("event_type", "page_view");

      // Count unique visitors (distinct session_id)
      const { data: sessions } = await supabase
        .from("analytics_events")
        .select("session_id")
        .eq("client_id", client.id)
        .eq("event_date", today)
        .eq("event_type", "page_view");

      const uniqueVisitors = new Set(
        (sessions || []).map((s) => s.session_id).filter(Boolean)
      ).size;

      // Count form submissions
      const { count: formSubmissions } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("client_id", client.id)
        .eq("event_date", today)
        .eq("event_type", "form_submission");

      // Top pages
      const { data: pageEvents } = await supabase
        .from("analytics_events")
        .select("properties")
        .eq("client_id", client.id)
        .eq("event_date", today)
        .eq("event_type", "page_view");

      const pageCounts: Record<string, number> = {};
      for (const e of pageEvents || []) {
        const page = e.properties?.page || "/";
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      }
      const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([page, count]) => ({ page, count }));

      // Traffic sources from referrer
      const sourceCounts: Record<string, number> = {};
      for (const e of pageEvents || []) {
        const referrer = e.properties?.referrer || "direct";
        let source = "direct";
        if (referrer && referrer !== "direct") {
          try {
            source = new URL(referrer).hostname;
          } catch {
            source = referrer;
          }
        }
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      }

      // Calculate bounce rate (sessions with only 1 page view)
      const sessionPageCounts: Record<string, number> = {};
      for (const e of pageEvents || []) {
        const sid = (e as { session_id?: string }).session_id || e.properties?.sessionId || "unknown";
        sessionPageCounts[sid] = (sessionPageCounts[sid] || 0) + 1;
      }
      const totalSessions = Object.keys(sessionPageCounts).length;
      const bouncedSessions = Object.values(sessionPageCounts).filter(
        (c) => c === 1
      ).length;
      const bounceRate =
        totalSessions > 0
          ? Math.round((bouncedSessions / totalSessions) * 100)
          : 0;

      await supabase.from("analytics_snapshots").upsert(
        {
          client_id: client.id,
          snapshot_date: today,
          page_views: pageViews || 0,
          unique_visitors: uniqueVisitors,
          bounce_rate: bounceRate,
          avg_session_duration: 0, // requires more complex tracking
          top_pages: topPages,
          traffic_sources: sourceCounts,
        },
        { onConflict: "client_id,snapshot_date" }
      );

      synced++;
    }

    return NextResponse.json({ success: true, synced });
  } catch (err) {
    console.error("Analytics sync error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
