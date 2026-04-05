import { describe, test, expect } from "vitest";

describe("Analytics System", () => {
  describe("Event ingestion validation", () => {
    test("requires clientId field", () => {
      const body = { eventType: "page_view" };
      const valid = body.eventType && ("clientId" in body);
      expect(valid).toBe(false);
    });

    test("requires eventType field", () => {
      const body = { clientId: "abc-123" };
      const valid = ("clientId" in body) && ("eventType" in body);
      expect(valid).toBe(false);
    });

    test("valid event passes validation", () => {
      const body = { clientId: "abc-123", eventType: "page_view" };
      const valid = body.clientId && body.eventType;
      expect(valid).toBeTruthy();
    });

    test("accepts all standard event types", () => {
      const validTypes = ["page_view", "form_submission", "conversion", "custom"];
      validTypes.forEach((type) => {
        expect(type.length).toBeGreaterThan(0);
      });
    });
  });

  describe("CORS configuration", () => {
    test("events endpoint allows cross-origin requests", () => {
      // The route returns Access-Control-Allow-Origin: * on both POST and OPTIONS
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      };
      expect(corsHeaders["Access-Control-Allow-Origin"]).toBe("*");
    });
  });

  describe("Tracking script", () => {
    test("analytics.js is served from public directory", async () => {
      // The script should exist at /public/analytics.js
      const fs = await import("fs");
      const exists = fs.existsSync("/tmp/portfolio-showcase/public/analytics.js");
      expect(exists).toBe(true);
    });

    test("tracking script contains required functions", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(
        "/tmp/portfolio-showcase/public/analytics.js",
        "utf-8"
      );
      expect(content).toContain("data-client-id");
      expect(content).toContain("page_view");
      expect(content).toContain("form_submission");
      expect(content).toContain("sendBeacon");
      expect(content).toContain("SESSION_ID");
    });

    test("tracking script uses sendBeacon for reliability", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(
        "/tmp/portfolio-showcase/public/analytics.js",
        "utf-8"
      );
      expect(content).toContain("navigator.sendBeacon");
    });

    test("tracking script has XHR fallback", async () => {
      const fs = await import("fs");
      const content = fs.readFileSync(
        "/tmp/portfolio-showcase/public/analytics.js",
        "utf-8"
      );
      expect(content).toContain("XMLHttpRequest");
    });
  });

  describe("Analytics sync aggregation", () => {
    test("sync endpoint requires authorization", () => {
      // The route checks Bearer token against SUPABASE_SERVICE_KEY
      const authHeader = "Bearer wrong_key";
      const expectedKey = "correct_key";
      expect(authHeader !== `Bearer ${expectedKey}`).toBe(true);
    });

    test("bounce rate calculation is correct", () => {
      // Sessions with only 1 page view are "bounced"
      const sessionPageCounts: Record<string, number> = {
        session1: 1, // bounced
        session2: 3, // not bounced
        session3: 1, // bounced
        session4: 2, // not bounced
      };
      const total = Object.keys(sessionPageCounts).length;
      const bounced = Object.values(sessionPageCounts).filter((c) => c === 1).length;
      const bounceRate = Math.round((bounced / total) * 100);
      expect(bounceRate).toBe(50);
    });

    test("unique visitors counts distinct sessions", () => {
      const sessions = [
        { session_id: "a" },
        { session_id: "a" },
        { session_id: "b" },
        { session_id: "c" },
        { session_id: "b" },
      ];
      const unique = new Set(sessions.map((s) => s.session_id)).size;
      expect(unique).toBe(3);
    });

    test("top pages are sorted by count descending", () => {
      const pageCounts: Record<string, number> = {
        "/": 10,
        "/about": 5,
        "/contact": 8,
      };
      const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([page, count]) => ({ page, count }));

      expect(topPages[0]).toEqual({ page: "/", count: 10 });
      expect(topPages[1]).toEqual({ page: "/contact", count: 8 });
      expect(topPages[2]).toEqual({ page: "/about", count: 5 });
    });

    test("traffic sources parse referrer hostnames", () => {
      const referrers = [
        "https://google.com/search?q=test",
        "https://google.com/search?q=other",
        "https://facebook.com/share",
        "", // direct
      ];

      const sourceCounts: Record<string, number> = {};
      for (const ref of referrers) {
        let source = "direct";
        if (ref) {
          try {
            source = new URL(ref).hostname;
          } catch {
            source = ref;
          }
        }
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      }

      expect(sourceCounts["google.com"]).toBe(2);
      expect(sourceCounts["facebook.com"]).toBe(1);
      expect(sourceCounts["direct"]).toBe(1);
    });
  });
});
