/**
 * Single source of truth for all pricing across the platform.
 * Marketing pages, API routes, Stripe checkout, and billing all reference this file.
 */

export interface PricingTier {
  id: string;
  name: string;
  monthlyCents: number;
  upfrontCents: number;
  stripePriceId: string | undefined;
  maxPages: number | null;
  maxServiceAreas: number | null;
  supportHours: number;
  tagline: string;
  popular: boolean;
  features: string[];
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  starter: {
    id: "starter",
    name: "Starter",
    monthlyCents: 10000, // $100/mo
    upfrontCents: 150000, // $1,500
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    maxPages: 8,
    maxServiceAreas: 5,
    supportHours: 2,
    tagline: "Perfect for getting started",
    popular: false,
    features: [
      "Custom website up to 8 pages",
      "Mobile responsive design",
      "Monthly content updates (up to 2 hrs)",
      "Basic SEO optimization",
      "< 24hr support response",
      "Hosted on Vercel (99.9% uptime)",
      "SSL certificate included",
    ],
  },
  professional: {
    id: "professional",
    name: "Professional",
    monthlyCents: 30000, // $300/mo
    upfrontCents: 250000, // $2,500
    stripePriceId: process.env.STRIPE_GROWTH_PRICE_ID,
    maxPages: 15,
    maxServiceAreas: 15,
    supportHours: 8,
    tagline: "Most popular choice",
    popular: true,
    features: [
      "Everything in Starter",
      "Up to 15 pages",
      "Advanced SEO + Google Search Console",
      "Analytics dashboard",
      "Monthly content updates (up to 8 hrs)",
      "Priority support (< 4hr response)",
      "Monthly performance report",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    monthlyCents: 60000, // $600/mo
    upfrontCents: 400000, // $4,000
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    maxPages: null, // unlimited
    maxServiceAreas: null, // unlimited
    supportHours: 20,
    tagline: "Full-service management",
    popular: false,
    features: [
      "Everything in Professional",
      "Unlimited pages",
      "Custom integrations (booking, payments)",
      "E-commerce ready",
      "Monthly content updates (up to 20 hrs)",
      "Same-day support response",
      "Dedicated account manager",
    ],
  },
} as const;

/** Ordered array for rendering in UI */
export const pricingTiersList = [
  PRICING_TIERS.starter,
  PRICING_TIERS.professional,
  PRICING_TIERS.enterprise,
];

/** Format cents to dollar string (e.g., 10000 -> "$100") */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

/** Get tier by ID, returns undefined if not found */
export function getTier(id: string): PricingTier | undefined {
  return PRICING_TIERS[id];
}

/** Lowest monthly price for marketing copy */
export const LOWEST_MONTHLY = formatPrice(PRICING_TIERS.starter.monthlyCents);

/** Highest monthly price for marketing copy */
export const HIGHEST_MONTHLY = formatPrice(PRICING_TIERS.enterprise.monthlyCents);

/** Price range string for structured data */
export const PRICE_RANGE = `${LOWEST_MONTHLY}-${HIGHEST_MONTHLY}/month`;

/** Comparison features for the services page table */
export interface ComparisonFeature {
  name: string;
  starter: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

export const comparisonFeatures: ComparisonFeature[] = [
  { name: "Custom website", starter: true, professional: true, enterprise: true },
  { name: "Mobile responsive", starter: true, professional: true, enterprise: true },
  { name: "SEO optimization", starter: "Basic", professional: "Advanced", enterprise: "Advanced" },
  { name: "Monthly updates", starter: "2 hrs", professional: "8 hrs", enterprise: "20 hrs" },
  { name: "Analytics dashboard", starter: false, professional: true, enterprise: true },
  { name: "Priority support", starter: false, professional: true, enterprise: true },
  { name: "Custom integrations", starter: false, professional: false, enterprise: true },
  { name: "Dedicated account manager", starter: false, professional: false, enterprise: true },
];
