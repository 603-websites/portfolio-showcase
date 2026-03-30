import type { Metadata } from "next";
import Link from "next/link";

// Item 4
export const metadata: Metadata = {
  title: "603 Websites | Managed Website Subscriptions",
};
import {
  Wrench,
  Server,
  BarChart3,
  Check,
  MessageSquare,
  DollarSign,
  Smartphone,
  RefreshCw,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import SectionReveal from "@/components/marketing/SectionReveal";
import ProjectBrowser from "@/components/marketing/ProjectBrowser";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import { projects } from "@/data/projects";
import { faqItems } from "@/data/faq";
import { pricingPlans } from "@/data/pricing";

const steps = [
  {
    icon: Wrench,
    title: "We Build It",
    description:
      "Tell us what you need. We design and develop your website from scratch.",
  },
  {
    icon: Server,
    title: "We Deploy It",
    description:
      "Your site goes live on fast, reliable hosting with SSL included.",
  },
  {
    icon: BarChart3,
    title: "We Manage It",
    description:
      "Monthly updates, support, and monitoring. You focus on your business.",
  },
];

const benefits = [
  {
    icon: MessageSquare,
    title: "You talk to the people who build it",
    description:
      "No account managers or middlemen. You work directly with the developers building your site.",
  },
  {
    icon: DollarSign,
    title: "One flat monthly fee: no surprises",
    description:
      "Everything is included in your plan. No hidden costs, no hourly billing, no scope creep charges.",
  },
  {
    icon: Smartphone,
    title: "Your site actually works on every device",
    description:
      "Every site is built mobile-first and tested on real devices, not just resized browser windows.",
  },
  {
    icon: RefreshCw,
    title: "Updates included every month",
    description:
      "Need content changes? New pages? We handle it as part of your plan: just send us a message.",
  },
  {
    icon: Zap,
    title: "Sites that load in under 2 seconds",
    description:
      "We build with modern tools and optimize everything. Your visitors won't wait around.",
  },
  {
    icon: Shield,
    title: "Cancel anytime, no lock-in",
    description:
      "Month-to-month plans with no contracts. If you're not happy, you can cancel anytime.",
  },
];

export default function HomePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6 md:pt-16 md:pb-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Website,{" "}
            <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
              Managed for You
            </span>
          </h1>
          <p className="text-xl text-text-muted mb-8 max-w-2xl">
            We build, deploy, and manage professional websites for small
            businesses. One monthly fee, no hassle.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <Link
              href="/services"
              className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 font-medium transition inline-flex items-center gap-2"
            >
              See Our Plans <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#work"
              className="border border-dark-border text-text hover:bg-dark-light rounded-lg px-6 py-3 font-medium transition"
            >
              View Our Work
            </a>
          </div>
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-2xl font-bold text-text">24/7</p>
              <p className="text-text-muted">Support &amp; 99.9% Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text">SEO</p>
              <p className="text-text-muted">Google Business Optimization</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text">More</p>
              <p className="text-text-muted">Guaranteed Business Traffic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work */}
      <section id="work" className="pt-4 pb-12">
        <SectionReveal>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Our Work</h2>
              <Link
                href="/projects"
                className="text-accent hover:underline text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </SectionReveal>
        <ProjectBrowser projects={projects} />
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet/[0.03] to-transparent pointer-events-none" />
        <SectionReveal>
          <div className="max-w-6xl mx-auto px-4 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="bg-dark-light border border-dark-border rounded-2xl p-8 text-center hover:border-violet/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-violet/10 flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="text-text-dim text-sm font-medium mb-2">
                    Step {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-text-muted">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Pricing */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-violet/[0.04] pointer-events-none" />
        <SectionReveal>
          <div className="max-w-6xl mx-auto px-4 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Simple, Flat Pricing
            </h2>
            <p className="text-text-muted text-center mb-16 max-w-xl mx-auto">
              One monthly fee covers everything. No hidden costs, no hourly
              billing.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
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
                  <p className="text-text-dim text-sm mb-4">{plan.tagline}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-text">
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
          </div>
        </SectionReveal>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-violet/[0.03] to-transparent pointer-events-none" />
        <SectionReveal>
          <div className="max-w-6xl mx-auto px-4 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why Work With Us
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-dark-light border border-dark-border rounded-2xl p-6 hover:border-accent/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-violet/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-text-muted text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <SectionReveal>
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Common Questions
            </h2>
            <FAQAccordion items={faqItems} />
          </div>
        </SectionReveal>
      </section>

      {/* CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.04] to-violet/[0.06] pointer-events-none" />
        <SectionReveal>
          <div className="max-w-3xl mx-auto px-4 text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Today
            </h2>
            <p className="text-text-muted mb-8 text-lg">
              Let&apos;s build your website. Pick a plan and we&apos;ll have you
              live in days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/order"
                className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-4 font-medium transition inline-flex items-center justify-center gap-2"
              >
                Let&apos;s Build Your Website{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:louissader42@gmail.com"
                className="border border-dark-border text-text-muted hover:text-text rounded-lg px-8 py-4 font-medium transition"
              >
                Or email us directly
              </a>
            </div>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
