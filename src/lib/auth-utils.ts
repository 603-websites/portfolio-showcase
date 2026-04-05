import type { User } from "@supabase/supabase-js";

/**
 * Get the user's role from the authoritative source (app_metadata).
 * Falls back to user_metadata for accounts created before the migration.
 * app_metadata is tamper-proof — only writable by the service_role key.
 */
export function getUserRole(user: User | null | undefined): string | null {
  if (!user) return null;
  return user.app_metadata?.role || user.user_metadata?.role || null;
}

export function isDev(user: User | null | undefined): boolean {
  return getUserRole(user) === "dev";
}

export function isClient(user: User | null | undefined): boolean {
  return getUserRole(user) === "client";
}
