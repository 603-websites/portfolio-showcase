"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";

interface ClientData {
  plan: string;
  subscription_status: string;
  next_billing_date: string | null;
  monthly_revenue: number;
}

interface Invoice {
  id: string;
  amount_cents: number;
  status: string;
  invoice_date: string;
  paid_at: string | null;
  invoice_pdf_url: string | null;
}

export default function ClientBillingPage() {
  const [client, setClient] = useState<ClientData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cu } = await supabase
        .from("client_users")
        .select("client_id")
        .eq("user_id", user.id)
        .single();
      if (!cu) return;

      const [clientRes, invoicesRes] = await Promise.all([
        supabase.from("clients").select("plan, subscription_status, next_billing_date, monthly_revenue").eq("id", cu.client_id).single(),
        supabase.from("invoices").select("*").eq("client_id", cu.client_id).order("invoice_date", { ascending: false }),
      ]);

      setClient(clientRes.data);
      setInvoices(invoicesRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // Silently fail
    }
    setPortalLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  const planColor = client?.plan === "pro" ? "bg-violet/10 text-violet" : client?.plan === "growth" ? "bg-success/10 text-success" : "bg-accent/10 text-accent";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-text-muted mt-1">Manage your subscription and view invoices</p>
      </div>

      {/* Subscription Info */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${planColor}`}>
                {client?.plan} plan
              </span>
              <span className={`text-sm font-medium ${client?.subscription_status === "active" ? "text-success" : "text-amber"}`}>
                {client?.subscription_status || "—"}
              </span>
            </div>
            <p className="text-text-muted text-sm">
              ${client?.monthly_revenue || 0}/month &middot; Next billing: {client?.next_billing_date || "—"}
            </p>
          </div>
          <button
            onClick={openPortal}
            disabled={portalLoading}
            className="border border-dark-border text-text hover:bg-dark-lighter rounded-lg px-4 py-2.5 font-medium transition flex items-center gap-2 disabled:opacity-50"
          >
            {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Manage Billing
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Invoice History</h2>
        {invoices.length === 0 ? (
          <p className="text-text-dim text-sm">No invoices yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border text-text-muted">
                  <th className="text-left pb-3">Date</th>
                  <th className="text-left pb-3">Amount</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-left pb-3">PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-dark-border last:border-0">
                    <td className="py-3 text-text">{inv.invoice_date}</td>
                    <td className="py-3 text-text font-medium">${(inv.amount_cents / 100).toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium ${inv.status === "paid" ? "text-success" : inv.status === "failed" ? "text-error" : "text-text-dim"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {inv.invoice_pdf_url ? (
                        <a href={inv.invoice_pdf_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" /> View
                        </a>
                      ) : (
                        <span className="text-text-dim">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
