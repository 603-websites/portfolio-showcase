"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Appointment {
  id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url: string | null;
  status: string;
  client_id: string | null;
}

interface Client {
  id: string;
  name: string;
}

export function AppointmentActions({
  appointment,
  clients,
}: {
  appointment: Appointment;
  clients: Client[];
}) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dt = new Date(appointment.scheduled_at);
  const [title, setTitle] = useState(appointment.title);
  const [clientId, setClientId] = useState(appointment.client_id || "");
  const [date, setDate] = useState(dt.toISOString().split("T")[0]);
  const [time, setTime] = useState(dt.toTimeString().slice(0, 5));
  const [duration, setDuration] = useState(String(appointment.duration_minutes));
  const [meetingUrl, setMeetingUrl] = useState(appointment.meeting_url || "");
  const [status, setStatus] = useState(appointment.status);

  const handleDelete = async () => {
    if (!confirm("Delete this appointment?")) return;
    setDeleting(true);
    const res = await fetch(`/api/appointments?id=${appointment.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed to delete appointment.");
    } else {
      toast.success("Appointment deleted.");
      router.refresh();
    }
    setDeleting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedDate = new Date(`${date}T${time}`);
    if (isNaN(parsedDate.getTime())) { setError("Invalid date or time."); return; }
    setLoading(true);
    const res = await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: appointment.id,
        title,
        client_id: clientId || null,
        scheduled_at: parsedDate.toISOString(),
        duration_minutes: parseInt(duration),
        meeting_url: meetingUrl || null,
        status,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update.");
    } else {
      toast.success("Appointment updated.");
      setShowEdit(false);
      router.refresh();
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowEdit(true)}
          className="text-text-dim hover:text-accent transition p-1"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-text-dim hover:text-error transition p-1"
          title="Delete"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>

      {showEdit && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowEdit(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-dark-light border border-dark-border rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Edit Meeting</h2>
                <button onClick={() => setShowEdit(false)} className="text-text-muted hover:text-text">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Title</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Client</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent outline-none w-full text-sm"
                  >
                    <option value="">No client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Date</label>
                    <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                      className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent outline-none w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Time</label>
                    <input type="time" required value={time} onChange={(e) => setTime(e.target.value)}
                      className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent outline-none w-full text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Duration</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)}
                      className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent outline-none w-full text-sm">
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                      className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text focus:border-accent outline-none w-full text-sm">
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">Meeting Link</label>
                  <input type="url" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-2.5 text-text placeholder-text-dim focus:border-accent outline-none w-full text-sm" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
