/**
 * Audit logging helper.
 *
 * SQL to create the required table (run in Supabase SQL Editor):
 *
 * CREATE TABLE IF NOT EXISTS audit_logs (
 *   id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   action      text NOT NULL,
 *   entity_type text NOT NULL,
 *   entity_id   text NOT NULL,
 *   user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
 *   metadata    jsonb,
 *   created_at  timestamptz NOT NULL DEFAULT now()
 * );
 *
 * CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs (entity_type, entity_id);
 * CREATE INDEX IF NOT EXISTS audit_logs_user_idx   ON audit_logs (user_id);
 * CREATE INDEX IF NOT EXISTS audit_logs_created_at ON audit_logs (created_at DESC);
 */

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Writes an immutable audit record to the audit_logs table.
 * Failures are intentionally swallowed — audit logging must never break the
 * primary user flow.
 */
export async function logAudit(
  action: string,
  entityType: string,
  entityId: string,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("audit_logs").insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId ?? null,
      metadata: metadata ?? null,
    });
  } catch (err) {
    // Never throw — audit failures should not surface to users
    console.error("[audit] Failed to write audit log:", err);
  }
}
