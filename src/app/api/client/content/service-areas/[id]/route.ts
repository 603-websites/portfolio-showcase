import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getClientId(userId: string) {
  const admin = createAdminClient();
  const { data: cu, error } = await admin.from("client_users").select("client_id").eq("user_id", userId).single();
  if (error || !cu) return null;
  return cu.client_id as string;
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
