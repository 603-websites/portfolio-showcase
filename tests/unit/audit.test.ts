import { describe, test, expect, vi } from "vitest";

// Mock the Supabase admin client before importing audit
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

import { logAudit } from "@/lib/audit";
import { createAdminClient } from "@/lib/supabase/admin";

describe("Audit Logging", () => {
  test("logAudit does not throw on success", async () => {
    await expect(
      logAudit("test_action", "test_entity", "test-id-123")
    ).resolves.toBeUndefined();
  });

  test("logAudit does not throw on failure", async () => {
    // Override mock to simulate failure
    vi.mocked(createAdminClient).mockReturnValueOnce({
      from: vi.fn(() => ({
        insert: vi.fn().mockRejectedValue(new Error("DB error")),
      })),
    } as any);

    await expect(
      logAudit("test_action", "test_entity", "test-id-123")
    ).resolves.toBeUndefined();
  });

  test("logAudit passes correct parameters", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createAdminClient).mockReturnValueOnce({
      from: vi.fn(() => ({ insert: mockInsert })),
    } as any);

    await logAudit("service_area_updated", "hvac_service_area", "area-123", "user-456", {
      old: { label: "Old" },
      new: { label: "New" },
    });

    expect(mockInsert).toHaveBeenCalledWith({
      action: "service_area_updated",
      entity_type: "hvac_service_area",
      entity_id: "area-123",
      user_id: "user-456",
      metadata: { old: { label: "Old" }, new: { label: "New" } },
    });
  });

  test("logAudit handles missing optional params", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createAdminClient).mockReturnValueOnce({
      from: vi.fn(() => ({ insert: mockInsert })),
    } as any);

    await logAudit("test_action", "entity", "id-1");

    expect(mockInsert).toHaveBeenCalledWith({
      action: "test_action",
      entity_type: "entity",
      entity_id: "id-1",
      user_id: null,
      metadata: null,
    });
  });
});
