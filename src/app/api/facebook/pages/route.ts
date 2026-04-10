import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// GET — read fb_pages cookie for the pick-page UI
export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("fb_pages");
  if (!cookie) {
    return NextResponse.json({ error: "No pages cookie" }, { status: 400 });
  }
  try {
    const data = JSON.parse(Buffer.from(cookie.value, "base64url").toString());
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid cookie" }, { status: 400 });
  }
}

// POST — client picks a page; save it and clear cookie
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pageId } = await request.json();
  const cookie = request.cookies.get("fb_pages");
  if (!cookie) {
    return NextResponse.json({ error: "Session expired" }, { status: 400 });
  }

  const { userId, pages } = JSON.parse(
    Buffer.from(cookie.value, "base64url").toString()
  );

  // Verify the user matches what we stored in state
  if (userId !== user.id) {
    return NextResponse.json({ error: "User mismatch" }, { status: 403 });
  }

  const page = pages.find((p: { id: string }) => p.id === pageId);
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
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
      facebook_page_id: page.id,
      facebook_page_name: page.name,
      facebook_page_token: page.access_token,
      facebook_connected_at: new Date().toISOString(),
    })
    .eq("id", clientUser.client_id);

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("fb_pages");
  return response;
}
