"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";

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
  phone: "", email: "", address: "", city: "", state: "", zip: "",
  facebook: "", instagram: "", twitter: "", linkedin: "",
};

export default function ContactInfoEditorPage() {
  const [info, setInfo] = useState<ContactInfo>(DEFAULT_INFO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: cu } = await supabase.from("client_users").select("client_id").eq("user_id", user.id).single();
      if (!cu) return;
      setClientId(cu.client_id);
      const { data: content } = await supabase.from("website_content").select("*").eq("client_id", cu.client_id).eq("content_type", "contact_info").single();
      if (content?.content) setInfo({ ...DEFAULT_INFO, ...content.content });
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    await supabase.from("website_content").upsert(
      { client_id: clientId, content_type: "contact_info", content: info, is_published: true, updated_at: new Date().toISOString() },
      { onConflict: "client_id,content_type" }
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: keyof ContactInfo, value: string) => setInfo({ ...info, [field]: value });

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Info</h1>
          <p className="text-text-muted mt-1">Update your business contact details</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-success text-sm">Saved!</span>}
          <button onClick={handleSave} disabled={saving} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>

      <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">Contact</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Phone</label>
              <input value={info.phone} onChange={(e) => update("phone", e.target.value)} className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none" placeholder="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Email</label>
              <input value={info.email} onChange={(e) => update("email", e.target.value)} className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none" placeholder="hello@business.com" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">Address</h3>
          <div className="space-y-4">
            <input value={info.address} onChange={(e) => update("address", e.target.value)} className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none" placeholder="Street address" />
            <div className="grid grid-cols-3 gap-4">
              <input value={info.city} onChange={(e) => update("city", e.target.value)} className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none" placeholder="City" />
              <input value={info.state} onChange={(e) => update("state", e.target.value)} className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none" placeholder="State" />
              <input value={info.zip} onChange={(e) => update("zip", e.target.value)} className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none" placeholder="ZIP" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">Social Media</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(["facebook", "instagram", "twitter", "linkedin"] as const).map((platform) => (
              <div key={platform}>
                <label className="block text-sm text-text-muted mb-1 capitalize">{platform}</label>
                <input value={info[platform]} onChange={(e) => update(platform, e.target.value)} className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none" placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
