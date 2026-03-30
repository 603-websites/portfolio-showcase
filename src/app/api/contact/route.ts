import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      projectType,
      budgetRange,
      timeline,
      description,
      contactMethod,
      phone,
    } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }
    if (!description?.trim() || description.trim().length < 50) {
      return NextResponse.json(
        { error: "Description must be at least 50 characters" },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || null,
      project_type: projectType || null,
      budget_range: budgetRange || null,
      timeline: timeline || null,
      description: description.trim(),
      contact_method: contactMethod || "Email",
      phone: phone?.trim() || null,
      ip_address: ip,
    });

    if (error) {
      console.error("Contact submission error:", error);
      return NextResponse.json(
        { error: "Failed to submit. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission received",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
