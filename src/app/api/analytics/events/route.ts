import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/analytics/events
 * Public endpoint for ingesting analytics events from client websites.
 * No auth required — events are validated by client_id existence.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, sessionId, eventType, eventName, properties, userAgent } = body;

    if (!clientId || !eventType) {
      return NextResponse.json({ error: "clientId and eventType are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verify client exists
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .single();

    if (!client) {
      return NextResponse.json({ error: "Invalid client" }, { status: 403 });
    }

    // Get IP from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || null;

    await supabase.from("analytics_events").insert({
      client_id: clientId,
      event_type: eventType,
      event_name: eventName || eventType,
      properties: properties || null,
      session_id: sessionId || null,
      ip_address: ip,
      user_agent: userAgent || request.headers.get("user-agent") || null,
    });

    return new NextResponse(null, {
      status: 202,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Event ingestion error:", err);
    return NextResponse.json({ error: "Ingestion failed" }, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}

/**
 * OPTIONS — CORS preflight for cross-origin tracking requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
