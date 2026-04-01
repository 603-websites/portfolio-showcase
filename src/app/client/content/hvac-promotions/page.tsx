"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Tag, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface Promotion {
  id?: string;
  title: string;
  description: string;
  discount_text: string;
  expires_at: string;
  active: boolean;
}

export default function HvacPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/client/content/hvac-promotions");
      if (res.status === 401) { setSessionExpired(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to load promotions."); setLoading(false); return; }
      setPromotions(data);
      setLoading(false);
    };
    load();
  }, []);

  const addPromotion = () => {
    setPromotions([...promotions, { title: "", description: "", discount_text: "", expires_at: "", active: true }]);
  };

  const savePromotion = async (index: number) => {
    const item = promotions[index];
    if (!item.title.trim()) { toast.error("Title cannot be empty."); return; }
    setSaving(String(index));

    const body = { title: item.title, description: item.description, discount_text: item.discount_text, expires_at: item.expires_at || null, active: item.active };

    if (item.id) {
      const res = await fetch(`/api/client/content/hvac-promotions/${item.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to save."); }
      else { setPromotions((prev) => prev.map((p, i) => i === index ? data : p)); toast.success("Saved!"); }
    } else {
      const res = await fetch("/api/client/content/hvac-promotions", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to add promotion."); }
      else { setPromotions((prev) => prev.map((p, i) => i === index ? data : p)); toast.success("Promotion added!"); }
    }
    setSaving(null);
  };

  const deletePromotion = async (index: number) => {
    const item = promotions[index];
    if (!item.id) { setPromotions(promotions.filter((_, i) => i !== index)); return; }
    setDeleting(item.id);
    const res = await fetch(`/api/client/content/hvac-promotions/${item.id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete."); }
    else { setPromotions(promotions.filter((_, i) => i !== index)); toast.success("Deleted."); }
    setDeleting(null);
  };

  const update = (index: number, field: keyof Promotion, value: string | boolean) => {
    setPromotions(promotions.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  if (sessionExpired) return <SessionExpiredModal show />;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-36 bg-dark-lighter rounded" />
            <div className="h-4 w-48 bg-dark-lighter rounded" />
          </div>
          <div className="h-10 w-36 bg-dark-lighter rounded-lg" />
        </div>
        {[1, 2].map((i) => <div key={i} className="bg-dark-light border border-dark-border rounded-xl p-6 h-40 bg-dark-lighter" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-text-muted mt-1">Special deals and seasonal offers on your site</p>
        </div>
        <button onClick={addPromotion} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Promotion
        </button>
      </div>

      {promotions.length === 0 && (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <Tag className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">No Promotions Yet</h3>
          <p className="text-text-dim text-sm">Add seasonal deals like "$50 off first service" or "Free AC inspection".</p>
        </div>
      )}

      {promotions.map((item, index) => (
        <div key={item.id || index} className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Title</label>
              <input
                value={item.title}
                onChange={(e) => update(index, "title", e.target.value)}
                placeholder="e.g. Spring AC Tune-Up Special"
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Discount</label>
              <input
                value={item.discount_text}
                onChange={(e) => update(index, "discount_text", e.target.value)}
                placeholder="e.g. $50 off / Free inspection"
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Description</label>
            <textarea
              value={item.description}
              onChange={(e) => update(index, "description", e.target.value)}
              rows={2}
              placeholder="Any additional details about this promotion..."
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none resize-none text-sm"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input type="checkbox" checked={item.active} onChange={(e) => update(index, "active", e.target.checked)} className="accent-accent" />
              Active
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-muted">Expires</label>
              <input
                type="date"
                value={item.expires_at || ""}
                onChange={(e) => update(index, "expires_at", e.target.value)}
                className="bg-dark-lighter border border-dark-border rounded-lg px-3 py-1.5 text-sm text-text focus:border-accent outline-none"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => deletePromotion(index)} disabled={deleting === item.id} className="text-text-dim hover:text-error transition p-1.5">
                {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <button onClick={() => savePromotion(index)} disabled={saving === String(index)} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 flex items-center gap-1.5">
                {saving === String(index) && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      ))}

      {promotions.length > 0 && (
        <button onClick={addPromotion} className="border border-dashed border-dark-border rounded-xl p-5 w-full text-text-dim hover:text-accent hover:border-accent transition flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Another
        </button>
      )}
    </div>
  );
}
