import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/appointments
 * Devs see all appointments; clients see only their own.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isDev = user.user_metadata?.role === "dev";

    if (isDev) {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, clients(name)")
        .order("scheduled_at", { ascending: true });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data);
    }

    const { data: cu, error: cuError } = await supabase
      .from("client_users")
      .select("client_id")
      .eq("user_id", user.id)
      .single();

    if (cuError || !cu) {
      return NextResponse.json(
        { error: "Client record not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("client_id", cu.client_id)
      .order("scheduled_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[appointments] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/appointments
 * Updates an existing appointment (dev only).
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== "dev") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const admin = createAdminClient();
    const { data, error } = await admin.from("appointments").update(updates).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[appointments] PATCH error:", err);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

/**
 * DELETE /api/appointments
 * Deletes an appointment (dev only).
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata?.role !== "dev") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const admin = createAdminClient();
    const { error } = await admin.from("appointments").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[appointments] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}

/**
 * POST /api/appointments
 * Creates a new appointment (dev only).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "dev") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, client_id, scheduled_at, duration_minutes, meeting_url } =
      body as {
        title: string;
        client_id?: string | null;
        scheduled_at: string;
        duration_minutes: number;
        meeting_url?: string | null;
      };

    if (!title || !scheduled_at || !duration_minutes) {
      return NextResponse.json(
        { error: "title, scheduled_at, and duration_minutes are required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data: appointment, error } = await admin
      .from("appointments")
      .insert({
        title,
        scheduled_at,
        duration_minutes,
        meeting_url: meeting_url || null,
        client_id: client_id || null,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    console.error("[appointments] POST error:", err);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
