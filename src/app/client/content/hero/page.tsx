"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Save, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface HeroContent {
  tagline: string;
  subtext: string;
  cta_text: string;
  cta_link: string;
}

const DEFAULT: HeroContent = { tagline: "", subtext: "", cta_text: "", cta_link: "" };

export default function HeroEditorPage() {
  const [hero, setHero] = useState<HeroContent>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) { setSessionExpired(true); setLoading(false); return; }

        const { data: cu, error: cuError } = await supabase
          .from("client_users").select("client_id").eq("user_id", user.id).single();
        if (cuError || !cu) { setError("Failed to load your account."); setLoading(false); return; }
        setClientId(cu.client_id);

        const { data: content, error: contentError } = await supabase
          .from("website_content").select("*")
          .eq("client_id", cu.client_id).eq("content_type", "hero").single();
        if (contentError && contentError.code !== "PGRST116") {
          setError("Failed to load hero content."); setLoading(false); return;
        }
        if (content?.content) setHero({ ...DEFAULT, ...content.content });
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
      { client_id: clientId, content_type: "hero", content: hero, is_published: true, updated_at: new Date().toISOString() },
      { onConflict: "client_id,content_type" }
    );
    setSaving(false);
    if (saveError) toast.error("Failed to save. Please try again.");
    else toast.success("Hero section saved!");
  };

  const update = (field: keyof HeroContent, value: string) => setHero({ ...hero, [field]: value });

  if (sessionExpired) return <SessionExpiredModal show />;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-36 bg-dark-lighter rounded" />
            <div className="h-4 w-56 bg-dark-lighter rounded" />
          </div>
          <div className="h-10 w-24 bg-dark-lighter rounded-lg" />
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-dark-lighter rounded-lg" />)}
        </div>
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
          <h1 className="text-3xl font-bold">Hero Section</h1>
          <p className="text-text-muted mt-1">The first thing visitors see on your site</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>

      <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Content</span>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1">Headline / Tagline</label>
          <input
            value={hero.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            placeholder="e.g. Fresh Food, Amazing Flavors"
            className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1">Subtext</label>
          <textarea
            value={hero.subtext}
            onChange={(e) => update("subtext", e.target.value)}
            rows={3}
            placeholder="e.g. Located in downtown, open 7 days a week"
            className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-muted mb-1">Button Text</label>
            <input
              value={hero.cta_text}
              onChange={(e) => update("cta_text", e.target.value)}
              placeholder="e.g. View Menu / Get a Quote"
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-1">Button Link</label>
            <input
              value={hero.cta_link}
              onChange={(e) => update("cta_link", e.target.value)}
              placeholder="e.g. /menu or /contact"
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      {(hero.tagline || hero.subtext) && (
        <div className="bg-dark-light border border-dark-border rounded-xl p-6">
          <p className="text-xs text-text-dim uppercase tracking-wider mb-4">Preview</p>
          <div className="text-center py-8 space-y-3">
            {hero.tagline && <h2 className="text-2xl font-bold text-text">{hero.tagline}</h2>}
            {hero.subtext && <p className="text-text-muted max-w-md mx-auto">{hero.subtext}</p>}
            {hero.cta_text && (
              <span className="inline-block mt-2 bg-accent text-white px-6 py-2.5 rounded-lg font-medium text-sm">
                {hero.cta_text}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
