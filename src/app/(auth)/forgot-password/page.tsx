"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
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
      className="bg-dark-light border border-dark-border rounded-2xl p-8 w-full max-w-md"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
          S&C
        </h1>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-text text-center mb-2">
        Reset Password
      </h2>
      <p className="text-text-muted text-sm text-center mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {success ? (
        <div className="text-center py-4">
          <Mail size={40} className="text-accent mx-auto mb-4" />
          <p className="text-text font-medium">
            Check your email for the reset link
          </p>
          <p className="text-text-muted text-sm mt-2">
            We sent a password reset link to{" "}
            <span className="text-text">{email}</span>
          </p>
        </div>
      ) : (
        <>
          {/* Error */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Send Reset Link
            </button>
          </form>
        </>
      )}

      {/* Back to login */}
      <p className="text-center text-sm mt-6">
        <Link href="/login" className="text-accent hover:underline">
          Back to login
        </Link>
      </p>
    </motion.div>
  );
}
