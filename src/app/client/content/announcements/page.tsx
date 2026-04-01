"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bell, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface Announcement {
  id?: string;
  text: string;
  active: boolean;
  expires_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/client/content/announcements");
      if (res.status === 401) { setSessionExpired(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to load announcements."); setLoading(false); return; }
      setAnnouncements(data);
      setLoading(false);
    };
    load();
  }, []);

  const addAnnouncement = () => {
    setAnnouncements([...announcements, { text: "", active: true, expires_at: "" }]);
  };

  const saveAnnouncement = async (index: number) => {
    const item = announcements[index];
    if (!item.text.trim()) { toast.error("Announcement text cannot be empty."); return; }
    setSaving(String(index));

    if (item.id) {
      const res = await fetch(`/api/client/content/announcements/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.text, active: item.active, expires_at: item.expires_at || null }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to save."); } else {
        setAnnouncements((prev) => prev.map((a, i) => i === index ? data : a));
        toast.success("Saved!");
      }
    } else {
      const res = await fetch("/api/client/content/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.text, active: item.active, expires_at: item.expires_at || null }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to add announcement."); } else {
        setAnnouncements((prev) => prev.map((a, i) => i === index ? data : a));
        toast.success("Announcement added!");
      }
    }
    setSaving(null);
  };

  const deleteAnnouncement = async (index: number) => {
    const item = announcements[index];
    if (!item.id) { setAnnouncements(announcements.filter((_, i) => i !== index)); return; }
    setDeleting(item.id);
    const res = await fetch(`/api/client/content/announcements/${item.id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete."); }
    else { setAnnouncements(announcements.filter((_, i) => i !== index)); toast.success("Deleted."); }
    setDeleting(null);
  };

  const update = (index: number, field: keyof Announcement, value: string | boolean) => {
    setAnnouncements(announcements.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  if (sessionExpired) return <SessionExpiredModal show />;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-dark-lighter rounded" />
            <div className="h-4 w-56 bg-dark-lighter rounded" />
          </div>
          <div className="h-10 w-36 bg-dark-lighter rounded-lg" />
        </div>
        {[1, 2].map((i) => <div key={i} className="bg-dark-light border border-dark-border rounded-xl p-6 h-28 bg-dark-lighter" />)}
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
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-text-muted mt-1">Banners shown at the top of your site</p>
        </div>
        <button onClick={addAnnouncement} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Announcement
        </button>
      </div>

      {announcements.length === 0 && (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <Bell className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">No Announcements</h3>
          <p className="text-text-dim text-sm">Add banners for things like holiday hours, special events, or closures.</p>
        </div>
      )}

      {announcements.map((item, index) => (
        <div key={item.id || index} className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <textarea
              value={item.text}
              onChange={(e) => update(index, "text", e.target.value)}
              rows={2}
              placeholder="e.g. We will be closed Christmas Day. Happy Holidays!"
              className="flex-1 bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none resize-none text-sm"
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
              <button
                onClick={() => deleteAnnouncement(index)}
                disabled={deleting === item.id}
                className="text-text-dim hover:text-error transition p-1.5"
              >
                {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => saveAnnouncement(index)}
                disabled={saving === String(index)}
                className="bg-accent hover:bg-accent-hover text-white rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving === String(index) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      ))}

      {announcements.length > 0 && (
        <button onClick={addAnnouncement} className="border border-dashed border-dark-border rounded-xl p-5 w-full text-text-dim hover:text-accent hover:border-accent transition flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Another
        </button>
      )}
    </div>
  );
}
