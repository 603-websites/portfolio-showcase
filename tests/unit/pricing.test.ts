import { describe, test, expect } from "vitest";
import {
  PRICING_TIERS,
  pricingTiersList,
  getTier,
  formatPrice,
  LOWEST_MONTHLY,
  HIGHEST_MONTHLY,
  PRICE_RANGE,
  comparisonFeatures,
} from "@/config/pricing";

describe("Pricing Tier Logic", () => {
  describe("getTier()", () => {
    test("returns correct tier for starter", () => {
      const tier = getTier("starter");
      expect(tier).toBeDefined();
      expect(tier!.monthlyCents).toBe(10000); // $100
      expect(tier!.upfrontCents).toBe(150000); // $1,500
    });

    test("returns correct tier for professional", () => {
      const tier = getTier("professional");
      expect(tier).toBeDefined();
      expect(tier!.monthlyCents).toBe(30000); // $300
      expect(tier!.upfrontCents).toBe(250000); // $2,500
    });

    test("returns correct tier for enterprise", () => {
      const tier = getTier("enterprise");
      expect(tier).toBeDefined();
      expect(tier!.monthlyCents).toBe(60000); // $600
      expect(tier!.upfrontCents).toBe(400000); // $4,000
    });

    test("returns undefined for invalid tier", () => {
      const tier = getTier("invalid");
      expect(tier).toBeUndefined();
    });

    test("returns undefined for empty string", () => {
      expect(getTier("")).toBeUndefined();
    });
  });

  describe("formatPrice()", () => {
    test("formats whole dollar amounts without decimals", () => {
      expect(formatPrice(10000)).toBe("$100");
      expect(formatPrice(30000)).toBe("$300");
      expect(formatPrice(60000)).toBe("$600");
    });

    test("formats upfront costs correctly", () => {
      expect(formatPrice(150000)).toBe("$1500");
      expect(formatPrice(250000)).toBe("$2500");
      expect(formatPrice(400000)).toBe("$4000");
    });

    test("handles fractional cents with decimals", () => {
      expect(formatPrice(9999)).toBe("$99.99");
      expect(formatPrice(1)).toBe("$0.01");
    });

    test("handles zero", () => {
      expect(formatPrice(0)).toBe("$0");
    });
  });

  describe("Tier validation", () => {
    test("all tiers have required fields", () => {
      Object.values(PRICING_TIERS).forEach((tier) => {
        expect(tier.id).toBeDefined();
        expect(tier.name).toBeDefined();
        expect(tier.monthlyCents).toBeGreaterThan(0);
        expect(tier.upfrontCents).toBeGreaterThan(0);
        expect(tier.tagline).toBeDefined();
        expect(tier.features.length).toBeGreaterThan(0);
        expect(tier.supportHours).toBeGreaterThan(0);
      });
    });

    test("upfront cost does not exceed $5,000 limit", () => {
      Object.values(PRICING_TIERS).forEach((tier) => {
        expect(tier.upfrontCents).toBeLessThanOrEqual(500000);
      });
    });

    test("enterprise tier has higher price than professional", () => {
      const pro = getTier("professional")!;
      const ent = getTier("enterprise")!;
      expect(ent.monthlyCents).toBeGreaterThan(pro.monthlyCents);
      expect(ent.upfrontCents).toBeGreaterThan(pro.upfrontCents);
    });

    test("professional tier has higher price than starter", () => {
      const starter = getTier("starter")!;
      const pro = getTier("professional")!;
      expect(pro.monthlyCents).toBeGreaterThan(starter.monthlyCents);
      expect(pro.upfrontCents).toBeGreaterThan(starter.upfrontCents);
    });

    test("exactly one tier is marked as popular", () => {
      const popular = Object.values(PRICING_TIERS).filter((t) => t.popular);
      expect(popular).toHaveLength(1);
      expect(popular[0].id).toBe("professional");
    });
  });

  describe("Service area limits", () => {
    test("starter tier allows 5 service areas", () => {
      expect(getTier("starter")!.maxServiceAreas).toBe(5);
    });

    test("professional tier allows 15 service areas", () => {
      expect(getTier("professional")!.maxServiceAreas).toBe(15);
    });

    test("enterprise tier allows unlimited service areas (null)", () => {
      expect(getTier("enterprise")!.maxServiceAreas).toBeNull();
    });
  });

  describe("Page limits", () => {
    test("starter allows 8 pages", () => {
      expect(getTier("starter")!.maxPages).toBe(8);
    });

    test("professional allows 15 pages", () => {
      expect(getTier("professional")!.maxPages).toBe(15);
    });

    test("enterprise allows unlimited pages (null)", () => {
      expect(getTier("enterprise")!.maxPages).toBeNull();
    });
  });

  describe("Support hours allocation", () => {
    test("starter has 2 hours per month", () => {
      expect(getTier("starter")!.supportHours).toBe(2);
    });

    test("professional has 8 hours per month", () => {
      expect(getTier("professional")!.supportHours).toBe(8);
    });

    test("enterprise has 20 hours per month", () => {
      expect(getTier("enterprise")!.supportHours).toBe(20);
    });
  });

  describe("pricingTiersList", () => {
    test("contains exactly 3 tiers", () => {
      expect(pricingTiersList).toHaveLength(3);
    });

    test("is ordered: starter, professional, enterprise", () => {
      expect(pricingTiersList[0].id).toBe("starter");
      expect(pricingTiersList[1].id).toBe("professional");
      expect(pricingTiersList[2].id).toBe("enterprise");
    });
  });

  describe("Exported constants", () => {
    test("LOWEST_MONTHLY is $100", () => {
      expect(LOWEST_MONTHLY).toBe("$100");
    });

    test("HIGHEST_MONTHLY is $600", () => {
      expect(HIGHEST_MONTHLY).toBe("$600");
    });

    test("PRICE_RANGE is formatted correctly", () => {
      expect(PRICE_RANGE).toBe("$100-$600/month");
    });
  });

  describe("Comparison features", () => {
    test("has at least 5 features", () => {
      expect(comparisonFeatures.length).toBeGreaterThanOrEqual(5);
    });

    test("all features have all three tier columns", () => {
      comparisonFeatures.forEach((f) => {
        expect(f).toHaveProperty("starter");
        expect(f).toHaveProperty("professional");
        expect(f).toHaveProperty("enterprise");
      });
    });

    test("enterprise has all features that professional has", () => {
      comparisonFeatures.forEach((f) => {
        if (f.professional === true) {
          expect(f.enterprise).toBeTruthy();
        }
      });
    });
  });
});
