import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";
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

  // Idempotency: skip events we have already processed
  const { data: existing } = await supabase
    .from("processed_stripe_events")
    .select("id")
    .eq("event_id", event.id)
    .single();

  if (existing) {
    return NextResponse.json({ received: true, skipped: true });
  }

  // Mark event as processed before handling (prevents duplicate processing on retry)
  await supabase
    .from("processed_stripe_events")
    .insert({ event_id: event.id, event_type: event.type });

  try {
    switch (event.type) {
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("clients")
          .update({ subscription_status: sub.status })
          .eq("stripe_subscription_id", sub.id);

        // Item 9 — audit log
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("stripe_subscription_id", sub.id)
          .single();
        if (client) {
          await logAudit(
            "subscription_updated",
            "client",
            client.id,
            undefined,
            { stripe_subscription_id: sub.id, status: sub.status }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        // Item 8 — set status to "churned" so middleware blocks access
        await supabase
          .from("clients")
          .update({ status: "churned", subscription_status: "canceled" })
          .eq("stripe_subscription_id", sub.id);

        // Item 9 — audit log
        const { data: client } = await supabase
          .from("clients")
          .select("id")
          .eq("stripe_subscription_id", sub.id)
          .single();
        if (client) {
          await logAudit(
            "subscription_canceled",
            "client",
            client.id,
            undefined,
            {
              stripe_subscription_id: sub.id,
              canceled_at: new Date().toISOString(),
            }
          );
        }
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
                invoice_date: new Date(invoice.created * 1000)
                  .toISOString()
                  .split("T")[0],
                paid_at: new Date().toISOString(),
                invoice_pdf_url: invoice.invoice_pdf || null,
              },
              { onConflict: "stripe_invoice_id" }
            );

            // Item 9 — audit log
            await logAudit(
              "invoice_paid",
              "client",
              client.id,
              undefined,
              {
                stripe_invoice_id: invoice.id,
                amount_cents: invoice.amount_paid,
              }
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

          // Item 9 — audit log
          const { data: client } = await supabase
            .from("clients")
            .select("id")
            .eq("stripe_subscription_id", subId)
            .single();
          if (client) {
            await logAudit(
              "invoice_payment_failed",
              "client",
              client.id,
              undefined,
              { stripe_invoice_id: invoice.id }
            );
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err);
    // Remove the processed record so Stripe can retry
    await supabase
      .from("processed_stripe_events")
      .delete()
      .eq("event_id", event.id);
    return NextResponse.json(
      { error: "Event processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
