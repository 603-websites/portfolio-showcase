import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminSupabase = createAdminClient();
  const { data: clientUser } = await adminSupabase
    .from("client_users")
    .select("clients(facebook_page_id, facebook_page_token)")
    .eq("user_id", user.id)
    .single();

  const client = clientUser?.clients as unknown as {
    facebook_page_id: string | null;
    facebook_page_token: string | null;
  } | null;

  if (!client?.facebook_page_id || !client?.facebook_page_token) {
    return NextResponse.json({ error: "Facebook not connected" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "photos"; // "photos" | "videos"
  const after = searchParams.get("after") || "";

  let url: string;
  if (type === "videos") {
    url =
      `https://graph.facebook.com/${client.facebook_page_id}/videos?` +
      new URLSearchParams({
        access_token: client.facebook_page_token,
        fields: "id,title,description,source,picture,created_time",
        limit: "24",
        ...(after ? { after } : {}),
      });
  } else {
    url =
      `https://graph.facebook.com/${client.facebook_page_id}/photos?` +
      new URLSearchParams({
        access_token: client.facebook_page_token,
        fields: "id,name,images,created_time",
        type: "uploaded",
        limit: "24",
        ...(after ? { after } : {}),
      });
  }

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
