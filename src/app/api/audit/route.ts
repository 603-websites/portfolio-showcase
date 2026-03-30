import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { action, entityType, entityId, metadata } = await request.json();

    if (!action || !entityType || !entityId) {
      return NextResponse.json(
        { error: "action, entityType, and entityId are required" },
        { status: 400 }
      );
    }

    await logAudit(action, entityType, entityId, user?.id, metadata);
    return NextResponse.json({ ok: true });
  } catch {
    // Audit errors must never propagate to clients
    return NextResponse.json({ ok: true });
  }
}
