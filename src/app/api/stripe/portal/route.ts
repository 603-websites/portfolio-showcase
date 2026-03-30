import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
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
      .select("clients(stripe_customer_id)")
      .eq("user_id", user.id)
      .single();

    const clients = clientUser?.clients as unknown as { stripe_customer_id: string } | null;
    const stripeCustomerId = clients?.stripe_customer_id;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found" },
        { status: 404 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "https://websites-sader-carter.vercel.app";

    const params = new URLSearchParams();
    params.append("customer", stripeCustomerId);
    params.append("return_url", `${origin}/client/billing`);

    const response = await fetch(
      "https://api.stripe.com/v1/billing_portal/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
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
