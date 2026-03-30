import { NextResponse } from "next/server";

const PRICES: Record<string, number> = {
  starter: 10000,
  growth: 20000,
  pro: 25000,
};

export async function POST(request: Request) {
  try {
    const { package: pkg, name, email, description } = await request.json();

    if (!pkg || !name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Package, name, and email are required" },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
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

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("customer_email", email.trim());
    params.append("line_items[0][price_data][currency]", "usd");
    params.append(
      "line_items[0][price_data][product_data][name]",
      `${pkg.charAt(0).toUpperCase() + pkg.slice(1)} Website Package`
    );
    params.append("line_items[0][price_data][unit_amount]", amount.toString());
    params.append("line_items[0][quantity]", "1");
    params.append(
      "success_url",
      `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`
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
      return NextResponse.json(
        { error: "Payment setup failed" },
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
