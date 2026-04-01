import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Get client_id for this user
  const { data: cu, error: cuError } = await admin
    .from("client_users")
    .select("client_id")
    .eq("user_id", user.id)
    .single();

  if (cuError || !cu) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  // Fetch client + invoices
  const [clientRes, invoicesRes] = await Promise.all([
    admin.from("clients").select("id, name, plan, status, next_billing_date, stripe_subscription_id").eq("id", cu.client_id).single(),
    admin.from("invoices").select("*").eq("client_id", cu.client_id).order("invoice_date", { ascending: false }),
  ]);

  if (clientRes.error) return NextResponse.json({ error: clientRes.error.message }, { status: 500 });

  return NextResponse.json({ client: clientRes.data, invoices: invoicesRes.data || [] });
}
