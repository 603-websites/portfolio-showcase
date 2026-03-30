/**
 * Environment variable validation.
 * Imported in root layout so the server fails fast at startup if any required
 * variable is missing, rather than throwing a cryptic error mid-request.
 */

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_STARTER_PRICE_ID",
  "STRIPE_GROWTH_PRICE_ID",
  "STRIPE_PRO_PRICE_ID",
] as const;

type RequiredVar = (typeof REQUIRED_VARS)[number];

// Only validate on the server; NEXT_PUBLIC_ vars are available in the browser
// but server-only vars (SUPABASE_SERVICE_KEY, STRIPE_*) are not.
if (typeof window === "undefined") {
  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
          `Add it to .env.local and restart the dev server.`
      );
    }
  }
}

// Typed, non-nullable exports for use throughout the app.
// Using the non-null assertion is safe here because the check above
// guarantees the values are present at runtime.
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
  STRIPE_STARTER_PRICE_ID: process.env.STRIPE_STARTER_PRICE_ID as string,
  STRIPE_GROWTH_PRICE_ID: process.env.STRIPE_GROWTH_PRICE_ID as string,
  STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID as string,
} satisfies Record<RequiredVar, string>;
