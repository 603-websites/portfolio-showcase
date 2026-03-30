import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export const runtime = "nodejs";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("clients")
        .update({ subscription_status: sub.status })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("clients")
        .update({ status: "churned", subscription_status: "canceled" })
        .eq("stripe_subscription_id", sub.id);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

      if (subId) {
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("stripe_subscription_id", subId)
          .single();

        if (client) {
          await supabase.from("invoices").upsert(
            {
              client_id: client.id,
              stripe_invoice_id: invoice.id,
              amount_cents: invoice.amount_paid,
              status: "paid",
              invoice_date: new Date(
                invoice.created * 1000
              ).toISOString().split("T")[0],
              paid_at: new Date().toISOString(),
              invoice_pdf_url: invoice.invoice_pdf || null,
            },
            { onConflict: "stripe_invoice_id" }
          );
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

      if (subId) {
        await supabase
          .from("clients")
          .update({ subscription_status: "past_due" })
          .eq("stripe_subscription_id", subId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
