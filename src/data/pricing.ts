/**
 * @deprecated Use src/config/pricing.ts instead.
 * This file re-exports for backward compatibility with any imports.
 */
export {
  pricingTiersList as pricingPlans,
  comparisonFeatures,
  formatPrice,
} from "@/config/pricing";

export type { PricingTier as PricingPlan, ComparisonFeature } from "@/config/pricing";
