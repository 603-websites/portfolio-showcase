"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Wrench, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

interface Service {
  id?: string;
  name: string;
  description: string;
  price_display: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/client/content/services");
      if (res.status === 401) { setSessionExpired(true); setLoading(false); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to load services."); setLoading(false); return; }
      setServices(data);
      setLoading(false);
    };
    load();
  }, []);

  const addService = () => {
    setServices([...services, { name: "", description: "", price_display: "" }]);
  };

  const saveService = async (index: number) => {
    const item = services[index];
    if (!item.name.trim()) { toast.error("Service name cannot be empty."); return; }
    setSaving(String(index));

    if (item.id) {
      const res = await fetch(`/api/client/content/services/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.name, description: item.description, price_display: item.price_display }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to save."); }
      else { setServices((prev) => prev.map((s, i) => i === index ? data : s)); toast.success("Saved!"); }
    } else {
      const res = await fetch("/api/client/content/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: item.name, description: item.description, price_display: item.price_display }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error("Failed to add service."); }
      else { setServices((prev) => prev.map((s, i) => i === index ? data : s)); toast.success("Service added!"); }
    }
    setSaving(null);
  };

  const deleteService = async (index: number) => {
    const item = services[index];
    if (!item.id) { setServices(services.filter((_, i) => i !== index)); return; }
    setDeleting(item.id);
    const res = await fetch(`/api/client/content/services/${item.id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete."); }
    else { setServices(services.filter((_, i) => i !== index)); toast.success("Deleted."); }
    setDeleting(null);
  };

  const update = (index: number, field: keyof Service, value: string) => {
    setServices(services.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  if (sessionExpired) return <SessionExpiredModal show />;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-36 bg-dark-lighter rounded" />
            <div className="h-4 w-56 bg-dark-lighter rounded" />
          </div>
          <div className="h-10 w-32 bg-dark-lighter rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => <div key={i} className="bg-dark-light border border-dark-border rounded-xl p-6 h-36 bg-dark-lighter" />)}
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
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-text-muted mt-1">The services you offer listed on your website</p>
        </div>
        <button onClick={addService} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {services.length === 0 && (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <Wrench className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">No Services Yet</h3>
          <p className="text-text-dim text-sm">Add the services you offer — AC repair, furnace installation, etc.</p>
        </div>
      )}

      {services.map((item, index) => (
        <div key={item.id || index} className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Service Name</label>
              <input
                value={item.name}
                onChange={(e) => update(index, "name", e.target.value)}
                placeholder="e.g. AC Tune-Up"
                className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Price</label>
              <input
                value={item.price_display}
                onChange={(e) => update(index, "price_display", e.target.value)}
                placeholder="e.g. $89 / Call for quote"
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
              placeholder="Brief description of what this service includes..."
              className="w-full bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none resize-none text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button onClick={() => deleteService(index)} disabled={deleting === item.id} className="text-text-dim hover:text-error transition p-1.5">
              {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
            <button onClick={() => saveService(index)} disabled={saving === String(index)} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 flex items-center gap-1.5">
              {saving === String(index) && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
            </button>
          </div>
        </div>
      ))}

      {services.length > 0 && (
        <button onClick={addService} className="border border-dashed border-dark-border rounded-xl p-5 w-full text-text-dim hover:text-accent hover:border-accent transition flex items-center justify-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Another Service
        </button>
      )}
    </div>
  );
}
