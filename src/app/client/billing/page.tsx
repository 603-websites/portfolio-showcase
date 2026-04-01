"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CreditCard,
  ExternalLink,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate, formatCurrency } from "@/lib/format";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

// Item 4 — dynamic metadata not feasible for "use client"; title is set by
// the parent layout's <title> fallback. For static title use a separate
// server wrapper, but here we keep this file client-only per original design.

interface ClientData {
  plan: string;
  subscription_status: string;
  stripe_subscription_id: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/client/billing");
        if (res.status === 401) { setSessionExpired(true); setLoading(false); return; }
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load billing data.");
          setLoading(false);
          return;
        }
        setClient(data.client);
        setInvoices(data.invoices || []);
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not open billing portal. Please try again.");
      }
    } catch {
      toast.error("Failed to connect to billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  // Item 8 — cancel subscription directly via Stripe portal cancellation flow
  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flow: "subscription_cancel" }),
      });
      const data = await res.json();
      if (data.url) {
        // Item 9 — audit log via API happens server-side in portal route
        window.location.href = data.url;
      } else {
        toast.error("Could not initiate cancellation. Please try again.");
        setShowCancelModal(false);
      }
    } catch {
      toast.error("Failed to initiate cancellation.");
      setShowCancelModal(false);
    } finally {
      setCancelLoading(false);
    }
  };

  // Item 1 — loading skeleton
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-8 w-32 bg-dark-lighter rounded mb-2" />
          <div className="h-4 w-56 bg-dark-lighter rounded" />
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="h-5 w-28 bg-dark-lighter rounded mb-4" />
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-24 bg-dark-lighter rounded-full" />
              <div className="h-4 w-48 bg-dark-lighter rounded" />
            </div>
            <div className="h-10 w-36 bg-dark-lighter rounded-lg" />
          </div>
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <div className="h-5 w-32 bg-dark-lighter rounded mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-dark-border">
              <div className="h-4 w-24 bg-dark-lighter rounded" />
              <div className="h-4 w-16 bg-dark-lighter rounded" />
              <div className="h-4 w-12 bg-dark-lighter rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Item 2 — session expired modal
  if (sessionExpired) {
    return <SessionExpiredModal show />;
  }

  // Item 1 — error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const planColor =
    client?.plan === "pro"
      ? "bg-violet/10 text-violet"
      : client?.plan === "growth"
      ? "bg-success/10 text-success"
      : "bg-accent/10 text-accent";

  const isActive =
    client?.subscription_status === "active" ||
    client?.subscription_status === "trialing";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-text-muted mt-1">
          Manage your subscription and view invoices
        </p>
      </div>

      {/* Subscription Info */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${planColor}`}
              >
                {client?.plan} plan
              </span>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-success" : "text-amber"
                }`}
              >
                {client?.subscription_status || "—"}
              </span>
            </div>
            <p className="text-text-muted text-sm">
              ${client?.monthly_revenue || 0}/month
              {client?.next_billing_date && (
                <> &middot; Next billing: {formatDate(client.next_billing_date)}</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Item 8 — cancel button */}
            {isActive && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="border border-error/30 text-error hover:bg-error/10 rounded-lg px-4 py-2.5 font-medium transition text-sm"
              >
                Cancel Subscription
              </button>
            )}
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="border border-dark-border text-text hover:bg-dark-lighter rounded-lg px-4 py-2.5 font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              Manage Billing
            </button>
          </div>
        </div>
      </div>

      {/* Item 1 — empty state for invoices */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Invoice History</h2>
        {invoices.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <CreditCard className="w-10 h-10 text-text-dim mx-auto" />
            <p className="text-text-dim text-sm">No invoices yet.</p>
            <p className="text-text-dim text-xs">
              Your first invoice will appear here after your subscription renews.
            </p>
          </div>
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
                  <tr
                    key={inv.id}
                    className="border-b border-dark-border last:border-0"
                  >
                    {/* Item 6 — formatDate for local timezone */}
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
                    <td className="py-3">
                      {inv.invoice_pdf_url ? (
                        <a
                          href={inv.invoice_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-1"
                        >
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

      {/* Item 8 — Cancellation confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-light border border-dark-border rounded-2xl p-6 w-full max-w-md space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-error" />
                </div>
                <h2 className="text-lg font-semibold text-text">
                  Cancel Subscription?
                </h2>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-text-dim hover:text-text transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-dark-lighter rounded-xl p-4 space-y-2 text-sm text-text-muted">
              <p className="font-medium text-text">What happens when you cancel:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Your access continues until the end of your current billing
                  period.
                </li>
                <li>
                  After that date, your client dashboard access will be revoked.
                </li>
                <li>Your website will remain live until you request removal.</li>
                <li>You can resubscribe at any time to restore full access.</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 border border-dark-border text-text hover:bg-dark-lighter rounded-lg px-4 py-2.5 font-medium transition"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="flex-1 bg-error hover:bg-error/90 text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
