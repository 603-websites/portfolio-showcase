"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2 } from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: cu } = await supabase
        .from("client_users")
        .select("client_id")
        .eq("user_id", user.id)
        .single();
      if (!cu) return;
      setClientId(cu.client_id);

      const { data: content } = await supabase
        .from("website_content")
        .select("*")
        .eq("client_id", cu.client_id)
        .eq("content_type", "hours")
        .single();

      if (content?.content?.hours) {
        setHours(content.content.hours);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    await supabase.from("website_content").upsert(
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
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
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
        <div className="flex items-center gap-3">
          {saved && <span className="text-success text-sm">Saved!</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="bg-dark-light border border-dark-border rounded-xl p-6 space-y-4">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex items-center gap-4 py-3 border-b border-dark-border last:border-0"
          >
            <span className="w-28 text-text font-medium">{day}</span>
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={!hours[day].closed}
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
            {!hours[day].closed ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={hours[day].open}
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
                  value={hours[day].close}
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
