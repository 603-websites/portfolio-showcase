import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

async function getClientId(userId: string) {
  const admin = createAdminClient();
  const { data: cu, error } = await admin.from("client_users").select("client_id").eq("user_id", userId).single();
  if (error || !cu) return null;
  return cu.client_id as string;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = await getClientId(user.id);
  if (!clientId) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const { id } = await params;
  const body = await request.json();

  // Only allow updating label and sort_order
  const updates: Record<string, unknown> = {};
  if (body.label !== undefined) updates.label = body.label;
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify ownership
  const { data: existing } = await admin
    .from("hvac_service_areas")
    .select("*")
    .eq("id", id)
    .eq("client_id", clientId)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Service area not found" }, { status: 404 });
  }

  const { data, error } = await admin
    .from("hvac_service_areas")
    .update(updates)
    .eq("id", id)
    .eq("client_id", clientId)
    .select()
    .single();

  if (error) { console.error(error.message); return NextResponse.json({ error: "Operation failed" }, { status: 500 }); }

  await logAudit("service_area_updated", "hvac_service_area", id, user.id, {
    old: { label: existing.label, sort_order: existing.sort_order },
    new: updates,
  });

  return NextResponse.json(data);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = await getClientId(user.id);
  if (!clientId) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const { id } = await params;
  const admin = createAdminClient();
  const { error } = await admin.from("hvac_service_areas").delete().eq("id", id).eq("client_id", clientId);
  if (error) { console.error(error.message); return NextResponse.json({ error: "Operation failed" }, { status: 500 }); }

  await logAudit("service_area_deleted", "hvac_service_area", id, user.id);

  return NextResponse.json({ success: true });
}
