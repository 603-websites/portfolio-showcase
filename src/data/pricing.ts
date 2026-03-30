export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  setupFee: number;
  tagline: string;
  popular: boolean;
  features: string[];
}

export interface ComparisonFeature {
  name: string;
  starter: boolean | string;
  growth: boolean | string;
  pro: boolean | string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    setupFee: 599,
    tagline: "Perfect for getting started",
    popular: false,
    features: [
      "Custom website up to 5 pages",
      "Mobile responsive design",
      "Monthly content updates (up to 2 hrs)",
      "Basic SEO optimization",
      "< 24hr support response",
      "Hosted on Vercel (99.9% uptime)",
      "SSL certificate included",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 199,
    setupFee: 599,
    tagline: "Most popular choice",
    popular: true,
    features: [
      "Everything in Starter",
      "Up to 10 pages",
      "Advanced SEO + Google Search Console",
      "Analytics dashboard",
      "Monthly content updates (up to 4 hrs)",
      "Priority support (< 4hr response)",
      "Monthly performance report",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    setupFee: 599,
    tagline: "Full-service management",
    popular: false,
    features: [
      "Everything in Growth",
      "Unlimited pages",
      "Custom integrations (booking, payments)",
      "E-commerce ready",
      "Monthly content updates (up to 8 hrs)",
      "Same-day support response",
      "Dedicated account manager",
    ],
  },
];

export const comparisonFeatures: ComparisonFeature[] = [
  { name: "Custom website", starter: true, growth: true, pro: true },
  { name: "Mobile responsive", starter: true, growth: true, pro: true },
  {
    name: "SEO optimization",
    starter: "Basic",
    growth: "Advanced",
    pro: "Advanced",
  },
  {
    name: "Monthly updates",
    starter: "2 hrs",
    growth: "4 hrs",
    pro: "8 hrs",
  },
  { name: "Analytics dashboard", starter: false, growth: true, pro: true },
  { name: "Priority support", starter: false, growth: true, pro: true },
  { name: "Custom integrations", starter: false, growth: false, pro: true },
  {
    name: "Dedicated account manager",
    starter: false,
    growth: false,
    pro: true,
  },
];
