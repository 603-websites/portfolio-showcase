import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { email, password, name, phone, about, plan } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Password validation (mirror client-side checks server-side)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain a number or special character." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Use admin API to create user — role is set in app_metadata (tamper-proof,
    // only writable by service role) rather than user_metadata (client-writable).
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        role: "client",
      },
      user_metadata: {
        full_name: name || "",
        phone_number: phone || "",
        about: about || "",
        role: "client", // duplicated for backward compat, but app_metadata is authoritative
        ...(plan ? { plan } : {}),
      },
    });

    if (error) {
      // Map common Supabase admin errors to user-friendly messages
      if (error.message?.includes("already been registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      console.error("[signup] error:", error.message);
      return NextResponse.json({ error: "Account creation failed. Please try again." }, { status: 400 });
    }

    return NextResponse.json({ user: { id: data.user.id, email: data.user.email } });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
