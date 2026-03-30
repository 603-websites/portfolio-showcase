"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { pricingPlans } from "@/data/pricing";

function OrderForm() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "growth";

  const [plan, setPlan] = useState(defaultPlan);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);

  const selectedPlan = pricingPlans.find((p) => p.id === plan) || pricingPlans[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, name, email, businessName, phone, description }),
      });
      const data = await res.json();

      if (data.fallback) {
        setFallback(true);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fallback) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-dark-light border border-dark-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Almost There!</h2>
            <p className="text-text-muted mb-6">
              Our payment system is being set up. For now, email us to get
              started:
            </p>
            <a
              href={`mailto:louissader42@gmail.com?subject=New ${selectedPlan.name} Subscription&body=Name: ${name}%0AEmail: ${email}%0ABusiness: ${businessName}%0APlan: ${selectedPlan.name} ($${selectedPlan.price}/mo)%0A%0A${description}`}
              className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 font-medium transition inline-block"
            >
              Send Email to Get Started
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Get Started
        </h1>
        <p className="text-text-muted text-center mb-12">
          Choose your plan and we&apos;ll have you online in days.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Plan Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-4">1. Choose your plan</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {pricingPlans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`text-left border rounded-xl p-4 transition ${
                    plan === p.id
                      ? "border-accent bg-accent/5 ring-2 ring-accent"
                      : "border-dark-border bg-dark-light hover:border-text-dim"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-text">{p.name}</span>
                    {plan === p.id && (
                      <Check className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-text">
                    ${p.price}
                    <span className="text-sm text-text-muted font-normal">
                      /mo
                    </span>
                  </p>
                  <p className="text-text-dim text-xs mt-1">
                    + ${p.setupFee} setup
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">2. Your info</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  placeholder="My Business LLC"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Description */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              3. Tell us about your business
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
              placeholder="What does your business do? What kind of website are you looking for?"
            />
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-4 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              `Proceed to Checkout: $${selectedPlan.price}/mo`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderForm />
    </Suspense>
  );
}
