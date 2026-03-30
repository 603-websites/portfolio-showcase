import { createClient } from "@/lib/supabase/server";
import { Calendar, Clock, Video, User } from "lucide-react";

export const metadata = { title: "Calendar | Website Upgraders Dev" };

export default async function CalendarPage() {
  const supabase = await createClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, clients(name)")
    .order("scheduled_at", { ascending: true });

  const upcoming = (appointments || []).filter(
    (a) => new Date(a.scheduled_at) >= new Date()
  );
  const past = (appointments || []).filter(
    (a) => new Date(a.scheduled_at) < new Date()
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-text-muted mt-1">
          {upcoming.length} upcoming meetings
        </p>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="bg-dark-light border border-dark-border rounded-xl p-8 text-center">
            <Calendar className="w-10 h-10 text-text-dim mx-auto mb-3" />
            <p className="text-text-dim">No upcoming meetings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div
                key={apt.id}
                className="bg-dark-light border border-dark-border rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-text font-medium">{apt.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(apt.scheduled_at).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span>{apt.duration_minutes}min</span>
                      {apt.clients && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {(apt.clients as unknown as { name: string }).name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {apt.meeting_url && (
                  <a
                    href={apt.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <Video className="w-4 h-4" /> Join
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Past Meetings</h2>
          <div className="space-y-2">
            {past.slice(0, 10).map((apt) => (
              <div
                key={apt.id}
                className="bg-dark-light/50 border border-dark-border rounded-lg p-4 flex items-center justify-between opacity-60"
              >
                <div>
                  <p className="text-text text-sm">{apt.title}</p>
                  <p className="text-text-dim text-xs">
                    {new Date(apt.scheduled_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {apt.clients &&
                      ` · ${(apt.clients as unknown as { name: string }).name}`}
                  </p>
                </div>
                <span
                  className={`text-xs ${
                    apt.status === "completed"
                      ? "text-success"
                      : apt.status === "cancelled"
                      ? "text-error"
                      : "text-text-dim"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
