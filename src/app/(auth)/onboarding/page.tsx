"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");

  // Redirect devs away from onboarding
  useEffect(() => {
    const checkRole = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role === "dev") {
        router.replace("/dev/dashboard");
      }
    };
    checkRole();
  }, [router]);
  const [phone, setPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to complete onboarding.");
        return;
      }

      // Create client record
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          name: user.email?.split("@")[0] ?? "Unknown",
          business_name: businessName,
          email: user.email,
          phone: phone || null,
          website_url: websiteUrl || null,
          description: description || null,
          status: "active",
          subscription_status: "active",
          plan: user.user_metadata?.plan || "growth",
        })
        .select()
        .single();

      if (clientError) {
        setError(clientError.message);
        return;
      }

      // Create client_users junction
      const { error: junctionError } = await supabase
        .from("client_users")
        .insert({ client_id: newClient.id, user_id: user.id });

      if (junctionError) {
        setError(junctionError.message);
        return;
      }

      router.push("/client/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-dark-light border border-dark-border rounded-2xl p-8 w-full max-w-lg"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
          S&C
        </h1>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-text text-center mb-2">
        Tell us about your business
      </h2>
      <p className="text-text-muted text-sm text-center mb-6">
        We&apos;ll use this to set up your account.
      </p>

      {/* Error */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-text mb-1.5">
            Business Name <span className="text-error">*</span>
          </label>
          <input
            id="businessName"
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your Business Name"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-1.5">
            Phone Number{" "}
            <span className="text-text-dim font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-text mb-1.5">
            Existing Website URL{" "}
            <span className="text-text-dim font-normal">(optional)</span>
          </label>
          <input
            id="websiteUrl"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://..."
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text mb-1.5">
            Tell us about your business{" "}
            <span className="text-text-dim font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does your business do? What are your goals for your website?"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Complete Setup
        </button>
      </form>

      {/* Skip */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => router.push("/client/dashboard")}
          className="text-sm text-text-dim hover:text-text-muted transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}
