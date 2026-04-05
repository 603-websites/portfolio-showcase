import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Public endpoint — no auth required.
// Client sites call this to fetch all published content.
// Uses regular client (not admin) so RLS policies apply.
export async function GET(_: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const supabase = await createClient();

  // Fetch client type
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id, name, type")
    .eq("id", clientId)
    .single();

  if (clientError || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Fetch all website_content rows for this client
  const { data: contentRows } = await supabase
    .from("website_content")
    .select("content_type, content")
    .eq("client_id", clientId);

  const contentMap: Record<string, unknown> = {};
  for (const row of contentRows || []) {
    contentMap[row.content_type] = row.content;
  }

  if (client.type === "restaurant") {
    const { data: announcements } = await supabase
      .from("announcements")
      .select("id, text, active, expires_at")
      .eq("client_id", clientId)
      .eq("active", true)
      .order("sort_order");

    return NextResponse.json({
      type: "restaurant",
      name: client.name,
      hero: contentMap["hero"] || null,
      menu: contentMap["menu"] || null,
      hours: contentMap["hours"] || null,
      contact: contentMap["contact_info"] || null,
      announcements: announcements || [],
    });
  }

  // HVAC
  const [servicesRes, areasRes, promotionsRes] = await Promise.all([
    supabase.from("hvac_services").select("id, name, description, price_display").eq("client_id", clientId).order("sort_order"),
    supabase.from("hvac_service_areas").select("id, label").eq("client_id", clientId).order("sort_order"),
    supabase.from("hvac_promotions").select("id, title, description, discount_text, expires_at").eq("client_id", clientId).eq("active", true).order("sort_order"),
  ]);

  return NextResponse.json({
    type: "hvac",
    name: client.name,
    hero: contentMap["hero"] || null,
    hours: contentMap["hours"] || null,
    contact: contentMap["contact_info"] || null,
    services: servicesRes.data || [],
    service_areas: areasRes.data || [],
    promotions: promotionsRes.data || [],
  });
}
