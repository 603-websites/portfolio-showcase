"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

interface Promotion {
  title: string;
  description: string;
  discount: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export default function PromotionsEditorPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: cu } = await supabase
        .from("client_users")
        .select("client_id")
        .eq("user_id", user.id)
        .single();
      if (!cu) return;
      setClientId(cu.client_id);
      const { data: content } = await supabase
        .from("website_content")
        .select("*")
        .eq("client_id", cu.client_id)
        .eq("content_type", "promotions")
        .single();
      if (content?.content?.promotions) {
        setPromotions(content.content.promotions);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    await supabase.from("website_content").upsert(
      {
        client_id: clientId,
        content_type: "promotions",
        content: { promotions },
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "client_id,content_type" }
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addPromotion = () => {
    setPromotions([
      ...promotions,
      { title: "", description: "", discount: "", startDate: "", endDate: "", active: true },
    ]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-text-muted mt-1">Manage your promotional offers</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-success text-sm">Saved!</span>}
          <button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>

      {promotions.map((promo, i) => (
        <div key={i} className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <input
              value={promo.title}
              onChange={(e) => { const u = [...promotions]; u[i].title = e.target.value; setPromotions(u); }}
              placeholder="Promotion title"
              className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-dark-border focus:border-accent outline-none text-text flex-1"
            />
            <button onClick={() => setPromotions(promotions.filter((_, j) => j !== i))} className="text-text-dim hover:text-error transition ml-4">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Description</label>
              <textarea value={promo.description} onChange={(e) => { const u = [...promotions]; u[i].description = e.target.value; setPromotions(u); }} rows={2} className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-dim focus:border-accent outline-none resize-none" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-text-muted mb-1">Discount</label>
                <input value={promo.discount} onChange={(e) => { const u = [...promotions]; u[i].discount = e.target.value; setPromotions(u); }} placeholder="20% off" className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-dim focus:border-accent outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-text-muted mb-1">Start</label>
                  <input type="date" value={promo.startDate} onChange={(e) => { const u = [...promotions]; u[i].startDate = e.target.value; setPromotions(u); }} className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">End</label>
                  <input type="date" value={promo.endDate} onChange={(e) => { const u = [...promotions]; u[i].endDate = e.target.value; setPromotions(u); }} className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text focus:border-accent outline-none" />
                </div>
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input type="checkbox" checked={promo.active} onChange={(e) => { const u = [...promotions]; u[i].active = e.target.checked; setPromotions(u); }} className="accent-accent" /> Active
          </label>
        </div>
      ))}

      <button onClick={addPromotion} className="border border-dashed border-dark-border rounded-xl p-6 w-full text-text-dim hover:text-accent hover:border-accent transition flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" /> Add Promotion
      </button>
    </div>
  );
}
