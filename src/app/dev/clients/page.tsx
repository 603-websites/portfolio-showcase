"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Plus, Search, Users, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { formatDate, formatCurrency } from "@/lib/format";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface Client {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string | null;
  plan: string;
  status: string;
  monthly_revenue: number;
  website_url: string | null;
  next_billing_date: string | null;
  created_at: string;

}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const supabase = createClient();

  const fetchClients = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setSessionExpired(true);
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setClients(data || []);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Item 14 — client-side filter
  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (sessionExpired) return <SessionExpiredModal show />;

  // Item 1 — error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchClients();
          }}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-text-muted mt-1">{clients.length} total clients</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Item 14 — search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, business, or email..."
          className="w-full bg-dark-light border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-dark-light border border-dark-border rounded-xl overflow-hidden">
        {/* Item 7 — overflow-x-auto for mobile */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left p-4 text-text-muted text-sm font-medium">
                  Client
                </th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">
                  Plan
                </th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">
                  Status
                </th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">
                  MRR
                </th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">
                  Next Billing
                </th>
                <th className="text-left p-4 text-text-muted text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Item 1 — skeleton rows
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-dark-border animate-pulse">
                    <td className="p-4">
                      <div className="h-4 w-32 bg-dark-lighter rounded mb-1" />
                      <div className="h-3 w-48 bg-dark-lighter rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-16 bg-dark-lighter rounded-full" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-12 bg-dark-lighter rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-dark-lighter rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-24 bg-dark-lighter rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-10 bg-dark-lighter rounded" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                // Item 1 — empty state
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Users className="w-10 h-10 text-text-dim mx-auto mb-3" />
                    <p className="text-text-dim">
                      {search
                        ? "No clients match your search."
                        : "No clients yet. Add your first client to get started."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-dark-border last:border-0 hover:bg-dark-lighter/50 transition"
                  >
                    <td className="p-4">
                      <p className="text-text font-medium">{c.name}</p>
                      <p className="text-text-dim text-xs">{c.email}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          c.plan === "pro"
                            ? "bg-violet/10 text-violet"
                            : c.plan === "growth"
                            ? "bg-success/10 text-success"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {c.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-medium ${
                          c.status === "active"
                            ? "text-success"
                            : c.status === "churned"
                            ? "text-error"
                            : "text-text-dim"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-text">
                      {/* Item 13 — formatCurrency */}
                      ${c.monthly_revenue || 0}/mo
                    </td>
                    <td className="p-4 text-text-muted text-sm">
                      {/* Item 6 — formatDate */}
                      {c.next_billing_date
                        ? formatDate(c.next_billing_date)
                        : "—"}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dev/clients/${c.id}`}
                        className="text-accent text-sm hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onAdded={() => {
            setShowModal(false);
            fetchClients();
            toast.success("Client added successfully!");
          }}
        />
      )}
    </div>
  );
}

function AddClientModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    email: "",
    phone: "",
    plan: "growth",
    monthly_revenue: "",
    website_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and email are required");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("clients").insert({
      name: form.name,
      business_name: form.business_name || form.name,
      email: form.email,
      phone: form.phone || null,
      plan: form.plan,
      monthly_revenue: parseFloat(form.monthly_revenue) || 0,
      website_url: form.website_url || null,
      status: "active",
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      onAdded();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-light border border-dark-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Add Client</h2>
          <button onClick={onClose} className="text-text-dim hover:text-text">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              placeholder="Client name"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">
              Business Name
            </label>
            <input
              value={form.business_name}
              onChange={(e) =>
                setForm({ ...form, business_name: e.target.value })
              }
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Plan
              </label>
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent outline-none"
              >
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="pro">Pro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">
              Monthly Revenue ($)
            </label>
            <input
              type="number"
              value={form.monthly_revenue}
              onChange={(e) =>
                setForm({ ...form, monthly_revenue: e.target.value })
              }
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              placeholder="99"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">
              Website URL
            </label>
            <input
              value={form.website_url}
              onChange={(e) =>
                setForm({ ...form, website_url: e.target.value })
              }
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              placeholder="https://..."
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
}
