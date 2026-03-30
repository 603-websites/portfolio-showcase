"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Megaphone, Plus, Trash2, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

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
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
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

        const { data: cu, error: cuError } = await supabase
          .from("client_users")
          .select("client_id")
          .eq("user_id", user.id)
          .single();

        if (cuError || !cu) {
          setError("Failed to load your account.");
          setLoading(false);
          return;
        }
        setClientId(cu.client_id);

        const { data: content, error: contentError } = await supabase
          .from("website_content")
          .select("*")
          .eq("client_id", cu.client_id)
          .eq("content_type", "promotions")
          .single();

        if (contentError && contentError.code !== "PGRST116") {
          setError("Failed to load promotions.");
          setLoading(false);
          return;
        }

        if (content?.content?.promotions) {
          setPromotions(content.content.promotions);
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    const { error: saveError } = await supabase.from("website_content").upsert(
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
    if (saveError) {
      toast.error("Failed to save promotions. Please try again.");
    } else {
      toast.success("Promotions saved!");
    }
  };

  const addPromotion = () => {
    setPromotions([
      ...promotions,
      {
        title: "",
        description: "",
        discount: "",
        startDate: "",
        endDate: "",
        active: true,
      },
    ]);
  };

  if (sessionExpired) return <SessionExpiredModal show />;

  // Item 1 — loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-dark-lighter rounded" />
            <div className="h-4 w-56 bg-dark-lighter rounded" />
          </div>
          <div className="h-10 w-24 bg-dark-lighter rounded-lg" />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
            <div className="h-6 w-48 bg-dark-lighter rounded" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-20 bg-dark-lighter rounded-lg" />
              <div className="space-y-3">
                <div className="h-10 bg-dark-lighter rounded-lg" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 bg-dark-lighter rounded-lg" />
                  <div className="h-10 bg-dark-lighter rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
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
          onClick={() => window.location.reload()}
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
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-text-muted mt-1">Manage your promotional offers</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{" "}
          Save
        </button>
      </div>

      {/* Item 1 — empty state */}
      {promotions.length === 0 && (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <Megaphone className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">No Promotions Yet</h3>
          <p className="text-text-dim text-sm">
            Add your first promotion to showcase deals on your website.
          </p>
        </div>
      )}

      {promotions.map((promo, i) => (
        <div
          key={i}
          className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <input
              value={promo.title}
              onChange={(e) => {
                const u = [...promotions];
                u[i].title = e.target.value;
                setPromotions(u);
              }}
              placeholder="Promotion title"
              className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-dark-border focus:border-accent outline-none text-text flex-1"
            />
            <button
              onClick={() => setPromotions(promotions.filter((_, j) => j !== i))}
              className="text-text-dim hover:text-error transition ml-4"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Description
              </label>
              <textarea
                value={promo.description}
                onChange={(e) => {
                  const u = [...promotions];
                  u[i].description = e.target.value;
                  setPromotions(u);
                }}
                rows={2}
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-dim focus:border-accent outline-none resize-none"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  Discount
                </label>
                <input
                  value={promo.discount}
                  onChange={(e) => {
                    const u = [...promotions];
                    u[i].discount = e.target.value;
                    setPromotions(u);
                  }}
                  placeholder="20% off"
                  className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text placeholder-text-dim focus:border-accent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-text-muted mb-1">
                    Start
                  </label>
                  <input
                    type="date"
                    value={promo.startDate}
                    onChange={(e) => {
                      const u = [...promotions];
                      u[i].startDate = e.target.value;
                      setPromotions(u);
                    }}
                    className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-1">
                    End
                  </label>
                  <input
                    type="date"
                    value={promo.endDate}
                    onChange={(e) => {
                      const u = [...promotions];
                      u[i].endDate = e.target.value;
                      setPromotions(u);
                    }}
                    className="w-full bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text focus:border-accent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={promo.active}
              onChange={(e) => {
                const u = [...promotions];
                u[i].active = e.target.checked;
                setPromotions(u);
              }}
              className="accent-accent"
            />{" "}
            Active
          </label>
        </div>
      ))}

      <button
        onClick={addPromotion}
        className="border border-dashed border-dark-border rounded-xl p-6 w-full text-text-dim hover:text-accent hover:border-accent transition flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" /> Add Promotion
      </button>
    </div>
  );
}
