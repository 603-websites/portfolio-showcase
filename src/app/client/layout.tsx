import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ClientSidebar from "@/components/client/ClientSidebar";

// Item 4 — base title; individual pages override this with their own metadata
export const metadata: Metadata = {
  title: "Client Portal | Website Upgraders",
};

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "client") {
    redirect("/login");
  }

  // Get client info via junction table
  const adminSupabase = createAdminClient();
  const { data: clientUser } = await adminSupabase
    .from("client_users")
    .select("clients(id, name, plan, website_url, status, type)")
    .eq("user_id", user.id)
    .single();

  const client = (clientUser?.clients as unknown as { id: string; name: string; plan: string; website_url: string; status: string; type: string } | null) || {
    id: "",
    name: user.email || "Client",
    plan: "starter",
    website_url: "",
    status: "active",
    type: "restaurant",
  };

  return (
    <div className="min-h-screen bg-dark">
      <ClientSidebar client={{ name: client.name, plan: client.plan, type: client.type }} />
      <div className="lg:pl-64">
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
