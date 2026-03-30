import { NextResponse } from "next/server";
import Stripe from "stripe";
import { withTimeout, TimeoutError } from "@/lib/fetch";

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  growth: process.env.STRIPE_GROWTH_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
};

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

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://websites-sader-carter.vercel.app";

    const stripe = getStripe();

    // Item 15 — timeout wrapper; rejects after 10 seconds
    const session = await withTimeout(
      stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Website Setup Fee",
                description: description?.trim() || undefined,
              },
              unit_amount: 59900,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            plan,
            customerName: name.trim(),
            businessName: businessName?.trim() || "",
            phone: phone?.trim() || "",
          },
        },
        success_url: `${origin}/order/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
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
