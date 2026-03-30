"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (newPassword.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
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
      <h2 className="text-2xl font-semibold text-text text-center mb-6">
        Set New Password
      </h2>

      {success ? (
        <div className="text-center py-4">
          <p className="text-text font-medium">
            Password updated! Redirecting to login...
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-text mb-1.5">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
              />
              <p className="text-text-dim text-xs mt-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Update Password
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
