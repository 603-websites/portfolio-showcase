"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
}

export function NewAppointmentModal({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [meetingUrl, setMeetingUrl] = useState("");

  const reset = () => {
    setTitle("");
    setClientId("");
    setDate("");
    setTime("");
    setDuration("30");
    setMeetingUrl("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const scheduled_at = new Date(`${date}T${time}`).toISOString();

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          client_id: clientId || null,
          scheduled_at,
          duration_minutes: parseInt(duration),
          meeting_url: meetingUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create appointment");
        return;
      }

      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 text-sm font-medium transition"
      >
        <Plus className="w-4 h-4" />
        New Meeting
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => {
          setOpen(false);
          reset();
        }}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-dark-light border border-dark-border rounded-2xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">New Meeting</h2>
            <button
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="text-text-muted hover:text-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Website Review Call"
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Client (optional)
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full text-sm"
              >
                <option value="">No client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full text-sm"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Meeting Link (optional)
              </label>
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create Meeting
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
