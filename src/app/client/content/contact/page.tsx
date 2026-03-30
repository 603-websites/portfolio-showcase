"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}

const DEFAULT_INFO: ContactInfo = {
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
};

export default function ContactInfoEditorPage() {
  const [info, setInfo] = useState<ContactInfo>(DEFAULT_INFO);
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
          .eq("content_type", "contact_info")
          .single();

        if (contentError && contentError.code !== "PGRST116") {
          setError("Failed to load contact info.");
          setLoading(false);
          return;
        }

        if (content?.content) setInfo({ ...DEFAULT_INFO, ...content.content });
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
    const { error: saveError } = await supabase
      .from("website_content")
      .upsert(
        {
          client_id: clientId,
          content_type: "contact_info",
          content: info,
          is_published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "client_id,content_type" }
      );
    setSaving(false);
    if (saveError) {
      toast.error("Failed to save contact info. Please try again.");
    } else {
      toast.success("Contact info saved!");
    }
  };

  const update = (field: keyof ContactInfo, value: string) =>
    setInfo({ ...info, [field]: value });

  if (sessionExpired) return <SessionExpiredModal show />;

  // Item 1 — loading skeleton
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-dark-lighter rounded-lg" />
          ))}
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
          <h1 className="text-3xl font-bold">Contact Info</h1>
          <p className="text-text-muted mt-1">
            Update your business contact details
          </p>
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

      <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
            Contact
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Phone</label>
              <input
                value={info.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Email</label>
              <input
                value={info.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
                placeholder="hello@business.com"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
            Address
          </h3>
          <div className="space-y-4">
            <input
              value={info.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              placeholder="Street address"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                value={info.city}
                onChange={(e) => update("city", e.target.value)}
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
                placeholder="City"
              />
              <input
                value={info.state}
                onChange={(e) => update("state", e.target.value)}
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
                placeholder="State"
              />
              <input
                value={info.zip}
                onChange={(e) => update("zip", e.target.value)}
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
                placeholder="ZIP"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
            Social Media
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(["facebook", "instagram", "twitter", "linkedin"] as const).map(
              (platform) => (
                <div key={platform}>
                  <label className="block text-sm text-text-muted mb-1 capitalize">
                    {platform}
                  </label>
                  <input
                    value={info[platform]}
                    onChange={(e) => update(platform, e.target.value)}
                    className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
                    placeholder={`https://${platform}.com/...`}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
