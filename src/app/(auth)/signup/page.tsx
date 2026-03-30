"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasMinLength) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!hasSpecialChar) {
      setError("Password must contain a number or special character.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone,
            about,
            role: "client",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      router.push("/onboarding");
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
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
          S&C
        </h1>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-text text-center mb-2">
        Create Your Account
      </h2>
      <p className="text-text-muted text-sm text-center mb-6">
        Get started with 603 Websites
      </p>

      {/* Error */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-1.5">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />
        </div>

        <div>
          <label htmlFor="about" className="block text-sm font-medium text-text mb-1.5">
            Tell Us About Your Business
          </label>
          <textarea
            id="about"
            autoComplete="off"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What does your business do? What kind of website are you looking for?"
            rows={3}
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full resize-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />

          {/* Password requirements */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  hasMinLength
                    ? "bg-success border-success"
                    : "border-dark-border"
                }`}>
                  {hasMinLength && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-xs ${hasMinLength ? "text-success" : "text-text-dim"}`}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  hasSpecialChar
                    ? "bg-success border-success"
                    : "border-dark-border"
                }`}>
                  {hasSpecialChar && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-xs ${hasSpecialChar ? "text-success" : "text-text-dim"}`}>
                  Contains a number or special character
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1.5">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="bg-dark-lighter border border-dark-border rounded-lg px-4 py-3 text-text placeholder-text-dim focus:border-accent focus:ring-1 focus:ring-accent outline-none w-full"
          />

          {/* Passwords match indicator */}
          {confirmPassword.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  passwordsMatch
                    ? "bg-success border-success"
                    : "border-dark-border"
                }`}>
                  {passwordsMatch && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-xs ${passwordsMatch ? "text-success" : "text-text-dim"}`}>
                  Passwords match
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !hasMinLength || !hasSpecialChar || !passwordsMatch}
          className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Create Account
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-text-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
