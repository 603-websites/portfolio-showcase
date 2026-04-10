import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createAdminClient();
  const { data: clientUser } = await adminSupabase
    .from("client_users")
    .select("client_id")
    .eq("user_id", user.id)
    .single();

  if (!clientUser) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  await adminSupabase
    .from("clients")
    .update({
      facebook_page_id: null,
      facebook_page_name: null,
      facebook_page_token: null,
      facebook_connected_at: null,
    })
    .eq("id", clientUser.client_id);

  return NextResponse.json({ ok: true });
}
