import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    // Verify API key for cron security
    const authHeader = request.headers.get("authorization");
    const expectedKey = process.env.CRON_SECRET;
    if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Get all active clients
    const { data: clients } = await supabase
      .from("clients")
      .select("id, website_url")
      .eq("status", "active");

    if (!clients?.length) {
      return NextResponse.json({ message: "No active clients" });
    }

    const today = new Date().toISOString().split("T")[0];

    // Insert placeholder snapshots for today (to be replaced with real analytics later)
    for (const client of clients) {
      await supabase.from("analytics_snapshots").upsert(
        {
          client_id: client.id,
          snapshot_date: today,
          page_views: 0,
          unique_visitors: 0,
          bounce_rate: 0,
          avg_session_duration: 0,
          top_pages: [],
          traffic_sources: {},
        },
        { onConflict: "client_id,snapshot_date" }
      );
    }

    return NextResponse.json({
      success: true,
      synced: clients.length,
    });
  } catch (err) {
    console.error("Analytics sync error:", err);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
