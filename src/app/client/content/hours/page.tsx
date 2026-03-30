"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Clock, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import SessionExpiredModal from "@/components/shared/SessionExpiredModal";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export default function HoursEditorPage() {
  const [hours, setHours] = useState<Record<string, DayHours>>(
    Object.fromEntries(
      DAYS.map((d) => [d, { open: "09:00", close: "17:00", closed: false }])
    )
  );
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
          .eq("content_type", "hours")
          .single();

        if (contentError && contentError.code !== "PGRST116") {
          setError("Failed to load hours.");
          setLoading(false);
          return;
        }

        if (content?.content?.hours) {
          setHours(content.content.hours);
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
        content_type: "hours",
        content: { hours },
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "client_id,content_type" }
    );
    setSaving(false);
    if (saveError) {
      toast.error("Failed to save hours. Please try again.");
    } else {
      toast.success("Business hours saved!");
    }
  };

  if (sessionExpired) return <SessionExpiredModal show />;

  // Item 1 — loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-dark-lighter rounded" />
            <div className="h-4 w-48 bg-dark-lighter rounded" />
          </div>
          <div className="h-10 w-24 bg-dark-lighter rounded-lg" />
        </div>
        <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="h-5 w-24 bg-dark-lighter rounded" />
              <div className="h-9 w-16 bg-dark-lighter rounded-lg" />
              <div className="h-9 w-24 bg-dark-lighter rounded-lg" />
              <div className="h-9 w-24 bg-dark-lighter rounded-lg" />
            </div>
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
          <h1 className="text-3xl font-bold">Business Hours</h1>
          <p className="text-text-muted mt-1">Set your weekly schedule</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      {/* Item 1 — empty state not applicable here (DAYS always present) */}
      <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
        {Object.keys(hours).length === 0 && (
          <div className="text-center py-6 space-y-2">
            <Clock className="w-10 h-10 text-text-dim mx-auto" />
            <p className="text-text-dim text-sm">No hours configured yet.</p>
          </div>
        )}
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex items-center gap-4 py-3 border-b border-dark-border last:border-0"
          >
            <span className="w-28 text-text font-medium">{day}</span>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={!hours[day]?.closed}
                onChange={(e) =>
                  setHours({
                    ...hours,
                    [day]: { ...hours[day], closed: !e.target.checked },
                  })
                }
                className="accent-accent"
              />
              Open
            </label>
            {!hours[day]?.closed ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={hours[day]?.open || "09:00"}
                  onChange={(e) =>
                    setHours({
                      ...hours,
                      [day]: { ...hours[day], open: e.target.value },
                    })
                  }
                  className="bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text focus:border-accent outline-none"
                />
                <span className="text-text-dim">to</span>
                <input
                  type="time"
                  value={hours[day]?.close || "17:00"}
                  onChange={(e) =>
                    setHours({
                      ...hours,
                      [day]: { ...hours[day], close: e.target.value },
                    })
                  }
                  className="bg-dark-lighter border border-dark-border rounded-lg px-3 py-2 text-sm text-text focus:border-accent outline-none"
                />
              </div>
            ) : (
              <span className="text-text-dim text-sm">Closed</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
