import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDev } from "@/lib/auth-utils";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isDev(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const [tasksRes, clientsRes] = await Promise.all([
    admin.from("tasks").select("*").order("sort_order"),
    admin.from("clients").select("id, name"),
  ]);

  if (tasksRes.error) {
    console.error("[dev/tasks] GET error:", tasksRes.error.message);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }

  return NextResponse.json({ tasks: tasksRes.data || [], clients: clientsRes.data || [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isDev(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const allowedFields = ["title", "description", "status", "priority", "due_date", "client_id"];
  const filtered: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) filtered[key] = body[key];
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from("tasks").insert(filtered).select().single();
  if (error) {
    console.error("[dev/tasks] POST error:", error.message);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isDev(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, priority, title, due_date, client_id } = await request.json();
  const admin = createAdminClient();
  const { data, error } = await admin.from("tasks").update({ status, priority, title, due_date, client_id }).eq("id", id).select().single();
  if (error) {
    console.error("[dev/tasks] PATCH error:", error.message);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
  return NextResponse.json(data);
}
