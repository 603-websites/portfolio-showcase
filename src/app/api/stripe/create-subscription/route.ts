import { NextResponse } from "next/server";
import Stripe from "stripe";
import { withTimeout, TimeoutError } from "@/lib/fetch";
import { getTier, formatPrice } from "@/config/pricing";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

export async function POST(request: Request) {
  try {
    const { plan, name, email, businessName, phone, description } =
      await request.json();

    if (!plan || !name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Plan, name, and email are required" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ fallback: true });
    }

    const tier = getTier(plan);
    if (!tier || !tier.stripePriceId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://website-upgraders.vercel.app";

    const stripe = getStripe();

    const session = await withTimeout(
      stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email.trim(),
        line_items: [
          // One-time setup fee as a recurring item for the first invoice
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${tier.name} Website Build`,
                description: `One-time setup fee for ${tier.name} plan`,
              },
              unit_amount: tier.upfrontCents,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
          // Monthly subscription
          {
            price: tier.stripePriceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            plan: tier.id,
            customerName: name.trim(),
            businessName: businessName?.trim() || "",
            phone: phone?.trim() || "",
          },
        },
        success_url: `${origin}/order/success?plan=${tier.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/order`,
      }),
      10_000
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.error("Stripe subscription timed out:", err.message);
      return NextResponse.json(
        {
          error:
            "Payment setup is taking too long. Please try again in a moment.",
        },
        { status: 503 }
      );
    }
    console.error("Subscription creation error:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again." },
      { status: 500 }
    );
  }
}
