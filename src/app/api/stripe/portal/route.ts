import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get client's Stripe customer ID
    const { data: clientUser } = await supabase
      .from("client_users")
      .select("client_id, clients(stripe_customer_id)")
      .eq("user_id", user.id)
      .single();

    const clients = clientUser?.clients as unknown as {
      stripe_customer_id: string;
    } | null;
    const stripeCustomerId = clients?.stripe_customer_id;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 404 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://websites-sader-carter.vercel.app";

    // Item 8 — optional flow_data for cancellation
    let body: string;
    try {
      const json = await request.json().catch(() => ({}));
      const flow = json?.flow;

      if (flow === "subscription_cancel") {
        // Direct the portal to the cancellation confirmation screen
        const params = new URLSearchParams();
        params.append("customer", stripeCustomerId);
        params.append("return_url", `${origin}/client/billing`);
        params.append("flow_data[type]", "subscription_cancel");
        body = params.toString();

        // Item 9 — audit log for subscription cancel initiated
        await logAudit(
          "subscription_cancel_initiated",
          "client",
          clientUser!.client_id,
          user.id,
          { stripe_customer_id: stripeCustomerId }
        );
      } else {
        const params = new URLSearchParams();
        params.append("customer", stripeCustomerId);
        params.append("return_url", `${origin}/client/billing`);
        body = params.toString();

        // Item 9 — audit log for portal open
        await logAudit(
          "billing_portal_opened",
          "client",
          clientUser!.client_id,
          user.id
        );
      }
    } catch {
      const params = new URLSearchParams();
      params.append("customer", stripeCustomerId);
      params.append("return_url", `${origin}/client/billing`);
      body = params.toString();
    }

    const response = await fetch(
      "https://api.stripe.com/v1/billing_portal/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    const session = await response.json();
    if (session.error) {
      return NextResponse.json(
        { error: "Failed to create portal session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
