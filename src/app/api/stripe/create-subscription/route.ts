import { NextResponse } from "next/server";

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  growth: process.env.STRIPE_GROWTH_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
};

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

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({
        fallback: true,
        email: "louissader42@gmail.com",
      });
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || "https://websites-sader-carter.vercel.app";

    // Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("customer_email", email.trim());
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", "Website Setup Fee");
    params.append("line_items[0][price_data][unit_amount]", "59900");
    params.append("line_items[0][price_data][recurring][interval]", "month");
    params.append("line_items[0][price_data][recurring][interval_count]", "1");
    params.append("line_items[0][quantity]", "1");
    params.append("line_items[1][price]", priceId);
    params.append("line_items[1][quantity]", "1");
    params.append(
      "subscription_data[metadata][plan]",
      plan
    );
    params.append(
      "subscription_data[metadata][customerName]",
      name.trim()
    );
    params.append(
      "subscription_data[metadata][businessName]",
      businessName?.trim() || ""
    );
    params.append(
      "success_url",
      `${origin}/order/success?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`
    );
    params.append("cancel_url", `${origin}/order`);

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
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
      console.error("Stripe error:", session.error);
      return NextResponse.json(
        { error: "Payment setup failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Subscription creation error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
