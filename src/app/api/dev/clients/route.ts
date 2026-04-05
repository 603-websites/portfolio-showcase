import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDev } from "@/lib/auth-utils";

export async function GET() {
  // Verify the requester is a dev user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isDev(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[dev/clients] GET error:", error.message);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isDev(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, plan, website_url, status, type } = body;
  const admin = createAdminClient();
  const { data, error } = await admin.from("clients").insert({ name, plan, website_url, status, type }).select().single();

  if (error) {
    console.error("[dev/clients] POST error:", error.message);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
  return NextResponse.json(data);
}
