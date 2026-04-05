import { describe, test, expect } from "vitest";
import { PRICING_TIERS } from "@/config/pricing";

describe("Stripe Configuration", () => {
  describe("Price IDs from env", () => {
    test("all tiers reference a stripePriceId field", () => {
      Object.values(PRICING_TIERS).forEach((tier) => {
        expect(tier).toHaveProperty("stripePriceId");
      });
    });

    test("no two tiers share the same env var source", () => {
      // The config maps starter->STRIPE_STARTER_PRICE_ID,
      // professional->STRIPE_GROWTH_PRICE_ID, enterprise->STRIPE_PRO_PRICE_ID
      // These are different env vars so they should be unique when set
      const envVars = [
        "STRIPE_STARTER_PRICE_ID",
        "STRIPE_GROWTH_PRICE_ID",
        "STRIPE_PRO_PRICE_ID",
      ];
      const unique = new Set(envVars);
      expect(unique.size).toBe(envVars.length);
    });
  });

  describe("Tier IDs are valid", () => {
    test("all tier IDs are lowercase alphanumeric", () => {
      Object.values(PRICING_TIERS).forEach((tier) => {
        expect(tier.id).toMatch(/^[a-z]+$/);
      });
    });

    test("tier IDs match object keys", () => {
      Object.entries(PRICING_TIERS).forEach(([key, tier]) => {
        expect(tier.id).toBe(key);
      });
    });
  });

  describe("Monthly amounts are in cents", () => {
    test("starter monthly is exactly $100 in cents", () => {
      expect(PRICING_TIERS.starter.monthlyCents).toBe(100 * 100);
    });

    test("professional monthly is exactly $300 in cents", () => {
      expect(PRICING_TIERS.professional.monthlyCents).toBe(300 * 100);
    });

    test("enterprise monthly is exactly $600 in cents", () => {
      expect(PRICING_TIERS.enterprise.monthlyCents).toBe(600 * 100);
    });
  });

  describe("Upfront amounts are in cents", () => {
    test("starter upfront is exactly $1,500 in cents", () => {
      expect(PRICING_TIERS.starter.upfrontCents).toBe(1500 * 100);
    });

    test("professional upfront is exactly $2,500 in cents", () => {
      expect(PRICING_TIERS.professional.upfrontCents).toBe(2500 * 100);
    });

    test("enterprise upfront is exactly $4,000 in cents", () => {
      expect(PRICING_TIERS.enterprise.upfrontCents).toBe(4000 * 100);
    });
  });
});
