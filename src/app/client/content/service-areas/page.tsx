"use client";

import { useEffect, useState } from "react";
import { AlertCircle, MapPin, Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface ServiceArea {
  id?: string;
  label: string;
}

export default function ServiceAreasPage() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpiredModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/client/content/service-areas");
      if (res.status === 401) { setSessionExpiredModal(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to load service areas."); setLoading(false); return; }
      setAreas(data);
      setLoading(false);
    };
    load();
  }, []);

  const addArea = async () => {
    if (!newLabel.trim()) return;
    setAdding(true);
    const res = await fetch("/api/client/content/service-areas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error("Failed to add area."); }
    else { setAreas([...areas, data]); setNewLabel(""); toast.success("Area added!"); }
    setAdding(false);
  };

  const updateArea = async (id: string) => {
    if (!editLabel.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/client/content/service-areas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editLabel.trim() }),
    });
    if (!res.ok) { toast.error("Failed to update."); }
    else {
      const updated = await res.json();
      setAreas(areas.map((a) => (a.id === id ? updated : a)));
      toast.success("Updated!");
    }
    setSaving(false);
    setEditingId(null);
  };

  const deleteArea = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/client/content/service-areas/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete."); }
    else { setAreas(areas.filter((a) => a.id !== id)); toast.success("Removed."); }
    setDeleting(null);
  };

  if (sessionExpired) return <SessionExpiredModal show />;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-dark-lighter rounded" />
        <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-10 bg-dark-lighter rounded-lg" />)}
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
      <div>
        <h1 className="text-3xl font-bold">Service Areas</h1>
        <p className="text-text-muted mt-1">Cities and towns you serve</p>
      </div>

      <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
        {areas.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <MapPin className="w-10 h-10 text-text-dim mx-auto" />
            <p className="text-text-dim text-sm">No service areas added yet.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <div key={area.id} className="flex items-center gap-2 bg-dark-lighter border border-dark-border rounded-full px-3 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              {editingId === area.id ? (
                <>
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateArea(area.id!);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="bg-dark border border-dark-border rounded px-2 py-0.5 text-sm text-text outline-none focus:border-accent w-32"
                    autoFocus
                  />
                  <button onClick={() => updateArea(area.id!)} disabled={saving} className="text-success hover:text-success/80 transition">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-text-dim hover:text-text transition">
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-text">{area.label}</span>
                  <button
                    onClick={() => { setEditingId(area.id!); setEditLabel(area.label); }}
                    className="text-text-dim hover:text-accent transition ml-1"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => area.id && deleteArea(area.id)}
                    disabled={deleting === area.id}
                    className="text-text-dim hover:text-error transition"
                  >
                    {deleting === area.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addArea()}
            placeholder="e.g. Manchester, NH"
            className="flex-1 bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none text-sm"
          />
          <button
            onClick={addArea}
            disabled={adding || !newLabel.trim()}
            className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
          </button>
        </div>
      </div>
    </div>
  );
}
