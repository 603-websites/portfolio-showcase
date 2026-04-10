import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ connected: false });
  }

  const adminSupabase = createAdminClient();
  const { data: clientUser } = await adminSupabase
    .from("client_users")
    .select("clients(facebook_page_id, facebook_page_name, facebook_connected_at)")
    .eq("user_id", user.id)
    .single();

  const client = clientUser?.clients as unknown as {
    facebook_page_id: string | null;
    facebook_page_name: string | null;
    facebook_connected_at: string | null;
  } | null;

  if (!client?.facebook_page_id) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    page_id: client.facebook_page_id,
    page_name: client.facebook_page_name,
    connected_at: client.facebook_connected_at,
  });
}
