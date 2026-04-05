import { NextResponse } from "next/server";
import Stripe from "stripe";
import { withTimeout, TimeoutError } from "@/lib/fetch";
import { PRICING_TIERS, getTier, formatPrice } from "@/config/pricing";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

export async function POST(request: Request) {
  try {
    const { package: pkg, name, email, description } = await request.json();

    if (!pkg || !name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Package, name, and email are required" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ fallback: true });
    }

    const tier = getTier(pkg);
    if (!tier) {
      return NextResponse.json(
        { error: "Invalid package" },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://website-upgraders.vercel.app";

    const stripe = getStripe();

    const session = await withTimeout(
      stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email.trim(),
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${tier.name} Website Package`,
                description: description?.trim() || undefined,
              },
              unit_amount: tier.upfrontCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/order`,
      }),
      10_000
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.error("Stripe checkout timed out:", err.message);
      return NextResponse.json(
        {
          error:
            "Payment setup is taking too long. Please try again in a moment.",
        },
        { status: 503 }
      );
    }
    console.error("Checkout session error:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again." },
      { status: 500 }
    );
  }
}
