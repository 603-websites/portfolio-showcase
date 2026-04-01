import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "dev") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const [clientsRes, invoicesRes] = await Promise.all([
    admin.from("clients").select("id, name, plan, status, monthly_revenue"),
    admin.from("invoices").select("*").order("invoice_date"),
  ]);

  if (clientsRes.error) return NextResponse.json({ error: clientsRes.error.message }, { status: 500 });
  if (invoicesRes.error) return NextResponse.json({ error: invoicesRes.error.message }, { status: 500 });

  return NextResponse.json({ clients: clientsRes.data, invoices: invoicesRes.data });
}
