/**
 * Seed script for development / demo environments.
 *
 * Run with:   npm run seed
 *
 * What it creates (idempotently):
 *   - 3 clients (one per plan: starter / growth / pro)
 *   - 5 invoices per client (mix of paid/unpaid, last 6 months)
 *   - 10 analytics snapshots per client (last 10 days, incrementing views)
 *   - 5 tasks in various stages
 *
 * Idempotency: matches on email for clients, stripe_invoice_id for invoices,
 * snapshot_date+client_id for analytics, and title for tasks.
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Load env vars from .env.local
// ---------------------------------------------------------------------------
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(".env.local not found. Create it with SUPABASE_URL and SUPABASE_SERVICE_KEY.");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---------------------------------------------------------------------------
// Seed data definitions
// ---------------------------------------------------------------------------

const SEED_CLIENTS = [
  {
    name: "Sarah Mitchell",
    business_name: "The Rustic Fork",
    email: "sarah@rusticfork.example.com",
    phone: "(603) 555-0101",
    plan: "starter",
    monthly_revenue: 99,
    website_url: "https://rusticfork.example.com",
    status: "active",
    subscription_status: "active",
  },
  {
    name: "James Alvarez",
    business_name: "Alvarez Auto & Tire",
    email: "james@alvarezauto.example.com",
    phone: "(603) 555-0202",
    plan: "growth",
    monthly_revenue: 199,
    website_url: "https://alvarezauto.example.com",
    status: "active",
    subscription_status: "active",
  },
  {
    name: "Priya Nair",
    business_name: "Nair Wellness Spa",
    email: "priya@nairwellness.example.com",
    phone: "(603) 555-0303",
    plan: "pro",
    monthly_revenue: 349,
    website_url: "https://nairwellness.example.com",
    status: "active",
    subscription_status: "active",
  },
];

const TASK_SEEDS = [
  { title: "Set up Google Analytics for Rustic Fork", status: "done", priority: "high" },
  { title: "Redesign homepage hero section", status: "in_progress", priority: "urgent" },
  { title: "Write SEO meta descriptions for all pages", status: "todo", priority: "medium" },
  { title: "Fix mobile menu on Alvarez Auto site", status: "review", priority: "high" },
  { title: "Add online booking widget to Nair Wellness", status: "todo", priority: "low" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

// ---------------------------------------------------------------------------
// Seeding functions
// ---------------------------------------------------------------------------

async function seedClients(): Promise<string[]> {
  const clientIds: string[] = [];

  for (const c of SEED_CLIENTS) {
    // Idempotency: check by email
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .eq("email", c.email)
      .single();

    if (existing) {
      console.log(`  Client already exists: ${c.business_name} (${existing.id})`);
      clientIds.push(existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({
        ...c,
        next_billing_date: daysAgo(-30), // 30 days from now
      })
      .select("id")
      .single();

    if (error) {
      console.error(`  Failed to insert client ${c.business_name}:`, error.message);
    } else if (data) {
      console.log(`  Created client: ${c.business_name} (${data.id})`);
      clientIds.push(data.id);
    }
  }

  return clientIds;
}

async function seedInvoices(clientIds: string[]) {
  for (const clientId of clientIds) {
    for (let i = 0; i < 5; i++) {
      const monthOffset = i + 1;
      const invoiceDate = monthsAgo(monthOffset);
      const isOld = monthOffset > 3;
      const status = isOld ? "paid" : i % 4 === 0 ? "unpaid" : "paid";
      const amountCents = randomBetween(9900, 34900);
      const stripeInvoiceId = `seed_inv_${clientId.slice(0, 8)}_${monthOffset}`;

      // Idempotency: match by stripe_invoice_id
      const { data: existing } = await supabase
        .from("invoices")
        .select("id")
        .eq("stripe_invoice_id", stripeInvoiceId)
        .single();

      if (existing) {
        continue; // already seeded
      }

      const { error } = await supabase.from("invoices").insert({
        client_id: clientId,
        stripe_invoice_id: stripeInvoiceId,
        amount_cents: amountCents,
        status,
        invoice_date: invoiceDate.toISOString().split("T")[0],
        paid_at: status === "paid" ? invoiceDate.toISOString() : null,
        invoice_pdf_url: null,
      });

      if (error) {
        console.error(`  Failed invoice for client ${clientId}:`, error.message);
      }
    }
    console.log(`  Seeded invoices for client ${clientId}`);
  }
}

async function seedAnalytics(clientIds: string[]) {
  for (const clientId of clientIds) {
    let baseViews = randomBetween(200, 800);
    let baseVisitors = Math.floor(baseViews * 0.6);

    for (let day = 9; day >= 0; day--) {
      const snapshotDate = daysAgo(day);

      // Idempotency: check by client_id + snapshot_date
      const { data: existing } = await supabase
        .from("analytics_snapshots")
        .select("id")
        .eq("client_id", clientId)
        .eq("snapshot_date", snapshotDate)
        .single();

      if (existing) {
        continue;
      }

      // Incrementally grow numbers day over day
      baseViews += randomBetween(10, 60);
      baseVisitors += randomBetween(5, 30);

      const { error } = await supabase.from("analytics_snapshots").insert({
        client_id: clientId,
        snapshot_date: snapshotDate,
        page_views: baseViews,
        unique_visitors: baseVisitors,
        bounce_rate: randomBetween(30, 70),
        avg_session_duration: randomBetween(60, 300),
      });

      if (error) {
        console.error(
          `  Failed analytics snapshot for client ${clientId} on ${snapshotDate}:`,
          error.message
        );
      }
    }
    console.log(`  Seeded analytics snapshots for client ${clientId}`);
  }
}

async function seedTasks(clientIds: string[]) {
  for (let i = 0; i < TASK_SEEDS.length; i++) {
    const t = TASK_SEEDS[i];

    // Idempotency: check by title
    const { data: existing } = await supabase
      .from("tasks")
      .select("id")
      .eq("title", t.title)
      .single();

    if (existing) {
      console.log(`  Task already exists: "${t.title}"`);
      continue;
    }

    const clientId = clientIds[i % clientIds.length] ?? null;
    const { error } = await supabase.from("tasks").insert({
      title: t.title,
      status: t.status,
      priority: t.priority,
      client_id: clientId,
      due_date: daysAgo(-randomBetween(1, 14)), // due in 1–14 days
      sort_order: i,
    });

    if (error) {
      console.error(`  Failed to insert task "${t.title}":`, error.message);
    } else {
      console.log(`  Created task: "${t.title}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Starting seed...\n");

  console.log("Seeding clients...");
  const clientIds = await seedClients();

  if (clientIds.length === 0) {
    console.error("No client IDs returned; aborting.");
    process.exit(1);
  }

  console.log("\nSeeding invoices...");
  await seedInvoices(clientIds);

  console.log("\nSeeding analytics snapshots...");
  await seedAnalytics(clientIds);

  console.log("\nSeeding tasks...");
  await seedTasks(clientIds);

  console.log("\nSeed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
