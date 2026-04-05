import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// In-memory rate limiting (per serverless instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100;
const WINDOW_MS = 60_000;

function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, value] of rateLimit) {
    if (now > value.resetAt) rateLimit.delete(key);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

/**
 * POST /api/analytics/events
 * Public endpoint for ingesting analytics events from client websites.
 * No auth required — events are validated by client_id existence.
 */
export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    // Periodically clean up expired entries
    if (rateLimit.size > 10_000) cleanupRateLimit();

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, {
        status: 429,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
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
