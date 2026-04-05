import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS: Record<string, number> = {
  login: 10,
  signup: 5,
};

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (!action || !MAX_ATTEMPTS[action]) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const supabase = createAdminClient();
    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

    const { count } = await supabase
      .from("auth_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("action", action)
      .gte("created_at", windowStart);

    if ((count ?? 0) >= MAX_ATTEMPTS[action]) {
      return NextResponse.json(
        { allowed: false, error: "Too many attempts. Please wait before trying again." },
        { status: 429 }
      );
    }

    // Record this attempt
    await supabase
      .from("auth_rate_limits")
      .insert({ ip_address: ip, action });

    return NextResponse.json({ allowed: true });
  } catch {
    // Fail closed: block requests if rate limiting itself errors
    return NextResponse.json({ allowed: false });
  }
}
