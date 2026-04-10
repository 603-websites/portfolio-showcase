import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !stateParam) {
    return NextResponse.redirect(
      new URL("/client/social?error=facebook_denied", origin)
    );
  }

  let userId: string;
  try {
    const decoded = JSON.parse(
      Buffer.from(stateParam, "base64url").toString()
    );
    userId = decoded.userId;
    if (!userId) throw new Error("No userId in state");
  } catch {
    return NextResponse.redirect(
      new URL("/client/social?error=invalid_state", origin)
    );
  }

  const appId = process.env.FACEBOOK_APP_ID!;
  const appSecret = process.env.FACEBOOK_APP_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/facebook/callback`;

  // Step 1: Exchange code for short-lived user token
  const tokenRes = await fetch(
    `https://graph.facebook.com/oauth/access_token?` +
      new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      })
  );
  const tokenData = await tokenRes.json();
  if (tokenData.error || !tokenData.access_token) {
    return NextResponse.redirect(
      new URL("/client/social?error=token_exchange", origin)
    );
  }

  // Step 2: Exchange short-lived token for long-lived token (60 days)
  const longLivedRes = await fetch(
    `https://graph.facebook.com/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: tokenData.access_token,
      })
  );
  const longLivedData = await longLivedRes.json();
  if (longLivedData.error || !longLivedData.access_token) {
    return NextResponse.redirect(
      new URL("/client/social?error=long_lived_token", origin)
    );
  }

  // Step 3: Get the list of pages the user manages
  const pagesRes = await fetch(
    `https://graph.facebook.com/me/accounts?` +
      new URLSearchParams({
        access_token: longLivedData.access_token,
        fields: "id,name,access_token,picture",
      })
  );
  const pagesData = await pagesRes.json();
  if (pagesData.error || !pagesData.data?.length) {
    return NextResponse.redirect(
      new URL("/client/social?error=no_pages", origin)
    );
  }

  // If multiple pages, redirect to page picker. If one, auto-connect it.
  // Store pages in a temporary cookie for the picker UI.
  const pages = pagesData.data as Array<{
    id: string;
    name: string;
    access_token: string;
    picture?: { data: { url: string } };
  }>;

  if (pages.length === 1) {
    // Auto-connect the only page
    await saveFacebookPage(userId, pages[0].id, pages[0].name, pages[0].access_token);
    return NextResponse.redirect(
      new URL("/client/social?connected=true", origin)
    );
  }

  // Multiple pages — pass them through a short-lived cookie to the picker
  const response = NextResponse.redirect(
    new URL("/client/social/pick-page", origin)
  );
  response.cookies.set(
    "fb_pages",
    Buffer.from(JSON.stringify({ userId, pages })).toString("base64url"),
    { httpOnly: true, maxAge: 300, path: "/" }
  );
  return response;
}

async function saveFacebookPage(
  userId: string,
  pageId: string,
  pageName: string,
  pageToken: string
) {
  const adminSupabase = createAdminClient();
  const { data: clientUser } = await adminSupabase
    .from("client_users")
    .select("client_id")
    .eq("user_id", userId)
    .single();

  if (!clientUser) return;

  await adminSupabase
    .from("clients")
    .update({
      facebook_page_id: pageId,
      facebook_page_name: pageName,
      facebook_page_token: pageToken,
      facebook_connected_at: new Date().toISOString(),
    })
    .eq("id", clientUser.client_id);
}
