import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getClientId(userId: string) {
  const admin = createAdminClient();
  const { data: cu, error } = await admin.from("client_users").select("client_id").eq("user_id", userId).single();
  if (error || !cu) return null;
  return cu.client_id as string;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = await getClientId(user.id);
  if (!clientId) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const admin = createAdminClient();
  const { data, error } = await admin.from("hvac_promotions").select("*").eq("client_id", clientId).order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = await getClientId(user.id);
  if (!clientId) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const body = await request.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("hvac_promotions").insert({ ...body, client_id: clientId }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
