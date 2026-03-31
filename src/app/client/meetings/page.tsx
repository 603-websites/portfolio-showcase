import { createClient } from "@/lib/supabase/server";
import { AlertCircle, Calendar, Clock, Video } from "lucide-react";
import { formatDatetime } from "@/lib/format";
import type { Metadata } from "next";

// Item 4
export const metadata: Metadata = {
  title: "Meetings | Client Portal | Website Upgraders",
};

export default async function ClientMeetingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cu, error: cuError } = await supabase
    .from("client_users")
    .select("client_id, clients(cal_booking_link)")
    .eq("user_id", user!.id)
    .single();

  // Item 1 — error state
  if (cuError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">Failed to load meetings.</p>
        <a
          href="/client/meetings"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </a>
      </div>
    );
  }

  const clientId = cu?.client_id;
  const bookingLink = (
    cu?.clients as unknown as { cal_booking_link: string | null } | null
  )?.cal_booking_link;

  const { data: appointments, error: apptError } = await supabase
    .from("appointments")
    .select("*")
    .eq("client_id", clientId || "")
    .order("scheduled_at", { ascending: true });

  if (apptError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-error" />
        <p className="text-text-muted">Failed to load appointment data.</p>
        <a
          href="/client/meetings"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          Retry
        </a>
      </div>
    );
  }

  const upcoming = (appointments || []).filter(
    (a) => new Date(a.scheduled_at) >= new Date()
  );
  const past = (appointments || []).filter(
    (a) => new Date(a.scheduled_at) < new Date()
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meetings</h1>
          <p className="text-text-muted mt-1">{upcoming.length} upcoming</p>
        </div>
        {bookingLink && (
          <a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-2.5 font-medium transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book a Meeting
          </a>
        )}
      </div>

      {/* Item 1 — empty state */}
      {upcoming.length === 0 && past.length === 0 ? (
        <div className="bg-dark-light border border-dark-border rounded-xl p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-text-dim mx-auto" />
          <h3 className="text-lg font-semibold text-text">No Meetings Yet</h3>
          <p className="text-text-dim text-sm">
            {bookingLink
              ? "Use the button above to schedule your first meeting."
              : "Your account manager will set up meeting scheduling for you."}
          </p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-dark-light border border-dark-border rounded-xl p-5 flex items-center justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-text font-medium">{apt.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                          {/* Item 6 — local timezone formatting */}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDatetime(apt.scheduled_at)}
                          </span>
                          <span>{apt.duration_minutes}min</span>
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
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Past</h2>
              <div className="space-y-2">
                {past.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-dark-light/50 border border-dark-border rounded-lg p-4 opacity-60"
                  >
                    <p className="text-text text-sm">{apt.title}</p>
                    {/* Item 6 — local timezone */}
                    <p className="text-text-dim text-xs">
                      {formatDatetime(apt.scheduled_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
