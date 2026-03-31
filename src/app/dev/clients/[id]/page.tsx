import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, formatCurrency } from "@/lib/format";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

// Item 4 — dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("clients")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: data?.name
      ? `${data.name} — Clients | Website Upgraders`
      : "Client Detail — Dev Portal | Website Upgraders",
  };
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [clientRes, tasksRes, invoicesRes] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase
      .from("tasks")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("*")
      .eq("client_id", id)
      .order("invoice_date", { ascending: false }),
  ]);

  const client = clientRes.data;
  if (!client) notFound();

  const tasks = tasksRes.data || [];
  const invoices = invoicesRes.data || [];

  const planColor =
    client.plan === "pro"
      ? "bg-violet/10 text-violet"
      : client.plan === "growth"
      ? "bg-success/10 text-success"
      : "bg-accent/10 text-accent";

  return (
    <div className="space-y-8">
      <Link
        href="/dev/clients"
        className="inline-flex items-center gap-2 text-text-muted hover:text-text text-sm transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>

      {/* Header */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <p className="text-text-muted">{client.business_name}</p>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${planColor}`}
              >
                {client.plan}
              </span>
              <span
                className={`text-xs font-medium ${
                  client.status === "active" ? "text-success" : "text-error"
                }`}
              >
                {client.status}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {client.email && (
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text border border-dark-border rounded-lg px-3 py-2 transition"
              >
                <Mail className="w-4 h-4" /> {client.email}
              </a>
            )}
            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text border border-dark-border rounded-lg px-3 py-2 transition"
              >
                <Phone className="w-4 h-4" /> {client.phone}
              </a>
            )}
            {client.website_url && (
              <a
                href={client.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline border border-dark-border rounded-lg px-3 py-2 transition"
              >
                <ExternalLink className="w-4 h-4" /> Visit Site
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subscription Info */}
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Subscription</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Monthly Revenue</dt>
              <dd className="text-text font-medium">
                ${client.monthly_revenue || 0}/mo
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Status</dt>
              <dd className="text-text font-medium">
                {client.subscription_status || "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Next Billing</dt>
              {/* Item 6 — formatDate */}
              <dd className="text-text font-medium">
                {client.next_billing_date
                  ? formatDate(client.next_billing_date)
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Stripe Customer</dt>
              <dd className="text-text-dim text-xs font-mono">
                {client.stripe_customer_id || "Not connected"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Tasks */}
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Tasks ({tasks.length})
          </h2>
          {tasks.length === 0 ? (
            <p className="text-text-dim text-sm">No tasks for this client.</p>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-dark-lighter"
                >
                  <span className="text-sm text-text">{t.title}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === "done"
                        ? "bg-success/10 text-success"
                        : t.status === "in_progress"
                        ? "bg-accent/10 text-accent"
                        : "bg-dark-border text-text-dim"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-dark-light border border-dark-border rounded-xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Invoices ({invoices.length})
          </h2>
          {invoices.length === 0 ? (
            <p className="text-text-dim text-sm">No invoices for this client.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border text-text-muted">
                    <th className="text-left pb-3">Date</th>
                    <th className="text-left pb-3">Amount</th>
                    <th className="text-left pb-3">Status</th>
                    <th className="text-left pb-3">Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-dark-border last:border-0"
                    >
                      {/* Item 6 — formatDate */}
                      <td className="py-3 text-text">{formatDate(inv.invoice_date)}</td>
                      {/* Item 13 — formatCurrency */}
                      <td className="py-3 text-text font-medium">
                        {formatCurrency(inv.amount_cents)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-medium ${
                            inv.status === "paid"
                              ? "text-success"
                              : inv.status === "failed"
                              ? "text-error"
                              : "text-text-dim"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-text-muted">
                        {/* Item 6 — formatDate */}
                        {inv.paid_at ? formatDate(inv.paid_at) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
