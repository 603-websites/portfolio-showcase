import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DevSidebar from "@/components/dev/DevSidebar";

// Item 4 — base title for dev portal; individual pages override
export const metadata: Metadata = {
  title: "Dev Portal | 603 Websites",
};

export default async function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "dev") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-dark">
      <DevSidebar
        user={{ email: user.email || "", full_name: user.user_metadata?.full_name }}
      />
      <div className="lg:pl-64">
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
