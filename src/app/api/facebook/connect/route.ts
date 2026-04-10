import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SCOPES = [
  "pages_read_engagement",
  "pages_read_user_content",
  "pages_show_list",
].join(",");

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!appId || !siteUrl) {
    return NextResponse.json(
      { error: "Facebook app not configured" },
      { status: 500 }
    );
  }

  const redirectUri = `${siteUrl}/api/facebook/callback`;
  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString("base64url");

  const url = new URL("https://www.facebook.com/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);

  return NextResponse.redirect(url.toString());
}
