"use client";

import { useEffect, useState } from "react";
import { AlertCircle, DollarSign, TrendingUp, Users, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import RevenueChart from "@/components/dev/RevenueChart";
import { formatCurrency } from "@/lib/format";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

// Item 4 — "use client" pages can't export metadata; title is in layout

interface Client {
  id: string;
  name: string;
  plan: string;
  status: string;
  monthly_revenue: number;
}

interface Invoice {
  id: string;
  client_id: string;
  amount_cents: number;
  status: string;
  invoice_date: string;
  paid_at: string | null;
}

export default function RevenuePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setSessionExpired(true);
        setLoading(false);
        return;
      }

      const [c, i] = await Promise.all([
        supabase
          .from("clients")
          .select("id, name, plan, status, monthly_revenue")
          // Item 12 — soft delete filter
          .is("deleted_at", null),
        supabase
          .from("invoices")
          .select("*")
          // Item 12
          .is("deleted_at", null)
          .order("invoice_date"),
      ]);

      if (c.error) throw c.error;
      if (i.error) throw i.error;

      setClients(c.data || []);
      setInvoices(i.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load revenue data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sessionExpired) return <SessionExpiredModal show />;

  // Item 1 — loading skeleton
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-8 w-32 bg-dark-lighter rounded mb-2" />
          <div className="h-4 w-40 bg-dark-lighter rounded" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-dark-light border border-dark-border rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <div className="h-4 w-24 bg-dark-lighter rounded" />
                <div className="w-5 h-5 bg-dark-lighter rounded" />
              </div>
              <div className="h-8 w-20 bg-dark-lighter rounded" />
            </div>
          ))}
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6 h-64 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  // Item 1 — error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">{error}</p>
        <button
          onClick={fetchData}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const activeClients = clients.filter((c) => c.status === "active");
  const mrr = activeClients.reduce((s, c) => s + (c.monthly_revenue || 0), 0);
  const avgRevenue =
    activeClients.length > 0 ? mrr / activeClients.length : 0;
  const totalInvoiced = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount_cents, 0);

  const planBreakdown = activeClients.reduce<Record<string, number>>(
    (acc, c) => {
      acc[c.plan] = (acc[c.plan] || 0) + (c.monthly_revenue || 0);
      return acc;
    },
    {}
  );

  const planColors: Record<string, string> = {
    starter: "bg-accent",
    growth: "bg-success",
    pro: "bg-violet",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Revenue</h1>
        <p className="text-text-muted mt-1">Financial overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm">Total MRR</span>
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold">${mrr.toLocaleString()}</p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm">ARR</span>
            <TrendingUp className="w-5 h-5 text-violet" />
          </div>
          <p className="text-3xl font-bold">
            ${(mrr * 12).toLocaleString()}
          </p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm">Avg Revenue/Client</span>
            <Users className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">${avgRevenue.toFixed(0)}</p>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm">Total Invoiced</span>
            <DollarSign className="w-5 h-5 text-amber" />
          </div>
          {/* Item 13 — formatCurrency */}
          <p className="text-3xl font-bold">{formatCurrency(totalInvoiced)}</p>
        </div>
      </div>

      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
        {invoices.filter((i) => i.status === "paid").length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <DollarSign className="w-10 h-10 text-text-dim" />
            <p className="text-text-dim text-sm">
              No paid invoices yet.
            </p>
          </div>
        ) : (
          <RevenueChart
            invoices={invoices
              .filter((i) => i.status === "paid")
              .map((i) => ({
                amount_cents: i.amount_cents,
                invoice_date: i.invoice_date,
              }))}
          />
        )}
      </div>

      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">MRR by Plan</h2>
        {Object.keys(planBreakdown).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
            <DollarSign className="w-8 h-8 text-text-dim" />
            <p className="text-text-dim text-sm">No active subscriptions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(planBreakdown).map(([plan, amount]) => (
              <div key={plan}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text capitalize">{plan}</span>
                  <span className="text-sm text-text font-medium">
                    ${amount.toLocaleString()}/mo
                  </span>
                </div>
                <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${planColors[plan] || "bg-accent"}`}
                    style={{
                      width: `${mrr > 0 ? (amount / mrr) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
