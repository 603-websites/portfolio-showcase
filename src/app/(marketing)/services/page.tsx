import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, Rocket, Server, Shield, ArrowRight } from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import { pricingPlans, comparisonFeatures } from "@/data/pricing";

export const metadata: Metadata = {
  title: "Services & Pricing — 603 Websites",
  description:
    "Simple monthly plans for professional managed websites. Starting at $99/month.",
};

const promises = [
  {
    icon: Rocket,
    title: "Fast Launch",
    description: "Most sites go live within days, not months.",
  },
  {
    icon: Server,
    title: "99.9% Uptime",
    description: "Hosted on Vercel with enterprise-grade reliability.",
  },
  {
    icon: Shield,
    title: "Cancel Anytime",
    description: "Month-to-month plans with no contracts or lock-in.",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple Pricing, No Surprises
            </h1>
            <p className="text-text-muted text-lg">
              Everything you need to get online and stay there. One monthly fee,
              no hidden costs.
            </p>
          </div>
        </SectionReveal>

        {/* Pricing Cards */}
        <SectionReveal delay={0.1}>
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-dark-light border rounded-2xl p-8 relative ${
                  plan.popular
                    ? "border-accent ring-2 ring-accent"
                    : "border-dark-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-text mb-1">
                  {plan.name}
                </h3>
                <p className="text-text-dim text-sm mb-6">{plan.tagline}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-text">
                    ${plan.price}
                  </span>
                  <span className="text-text-muted">/mo</span>
                  <p className="text-text-dim text-sm mt-1">
                    + ${plan.setupFee} one-time setup
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-text-muted"
                    >
                      <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/order?plan=${plan.id}`}
                  className={`block text-center rounded-lg px-6 py-3 font-medium transition ${
                    plan.popular
                      ? "bg-accent hover:bg-accent-hover text-white"
                      : "border border-dark-border text-text hover:bg-dark-lighter"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* Comparison Table */}
        <SectionReveal delay={0.2}>
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-8">
              Compare Plans
            </h2>
            <div className="bg-dark-light border border-dark-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left p-4 text-text-muted text-sm font-medium">
                        Feature
                      </th>
                      {pricingPlans.map((plan) => (
                        <th
                          key={plan.id}
                          className="p-4 text-center text-sm font-medium text-text"
                        >
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, i) => (
                      <tr
                        key={feature.name}
                        className={
                          i < comparisonFeatures.length - 1
                            ? "border-b border-dark-border"
                            : ""
                        }
                      >
                        <td className="p-4 text-text-muted text-sm">
                          {feature.name}
                        </td>
                        {(["starter", "growth", "pro"] as const).map((plan) => {
                          const val = feature[plan];
                          return (
                            <td
                              key={plan}
                              className="p-4 text-center text-sm"
                            >
                              {val === true ? (
                                <Check className="w-5 h-5 text-success mx-auto" />
                              ) : val === false ? (
                                <X className="w-5 h-5 text-text-dim mx-auto" />
                              ) : (
                                <span className="text-text-muted">{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Our Promise */}
        <SectionReveal delay={0.3}>
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-12">
              Our Promise
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {promises.map((item) => (
                <div
                  key={item.title}
                  className="text-center bg-dark-light border border-dark-border rounded-2xl p-8"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal delay={0.4}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-text-muted mb-8">
              Pick a plan and we&apos;ll have your site live in days.
            </p>
            <Link
              href="/order"
              className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-4 font-medium transition inline-flex items-center gap-2"
            >
              Choose Your Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
