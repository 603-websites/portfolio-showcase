import { NextResponse } from "next/server";
import Stripe from "stripe";

const PRICES: Record<string, number> = {
  starter: 10000,
  growth: 20000,
  pro: 25000,
};

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

    const amount = PRICES[pkg];
    if (!amount) {
      return NextResponse.json(
        { error: "Invalid package" },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "https://websites-sader-carter.vercel.app";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim(),
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${pkg.charAt(0).toUpperCase() + pkg.slice(1)} Website Package`,
              description: description?.trim() || undefined,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again." },
      { status: 500 }
    );
  }
}
