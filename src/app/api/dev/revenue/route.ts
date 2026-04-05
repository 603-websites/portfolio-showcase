import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDev } from "@/lib/auth-utils";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isDev(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const [clientsRes, invoicesRes] = await Promise.all([
    admin.from("clients").select("id, name, plan, status, monthly_revenue"),
    admin.from("invoices").select("*").order("invoice_date"),
  ]);

  if (clientsRes.error) {
    console.error("[dev/revenue] clients query error:", clientsRes.error.message);
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 });
  }
  if (invoicesRes.error) {
    console.error("[dev/revenue] invoices query error:", invoicesRes.error.message);
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 });
  }

  return NextResponse.json({ clients: clientsRes.data, invoices: invoicesRes.data });
}
