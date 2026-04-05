import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const allowedFields = ["name", "description", "price", "sort_order", "is_active", "category"];
  const filtered: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) filtered[key] = body[key];
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("hvac_services").update(filtered).eq("id", id).eq("client_id", clientId).select().single();
  if (error) { console.error(error.message); return NextResponse.json({ error: "Operation failed" }, { status: 500 }); }
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
  const { error } = await admin.from("hvac_services").delete().eq("id", id).eq("client_id", clientId);
  if (error) { console.error(error.message); return NextResponse.json({ error: "Operation failed" }, { status: 500 }); }
  return NextResponse.json({ success: true });
}
