"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const projectTypes = [
  "Business Website",
  "Portfolio",
  "E-commerce",
  "Landing Page",
  "Other",
];

const budgetRanges = [
  "Starter ($99/mo)",
  "Growth ($199/mo)",
  "Pro ($299/mo)",
  "Not sure yet",
];

const timelines = [
  "ASAP",
  "Within 2 weeks",
  "Within a month",
  "No rush",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budgetRange: "",
    timeline: "",
    description: "",
    contactMethod: "email",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-4xl">&#10003;</div>
        <h3 className="text-xl font-semibold text-text">Message Sent!</h3>
        <p className="mt-2 text-text-muted">
          We&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name & Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
            Full Name <span className="text-error">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
            Email <span className="text-error">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Company & Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-text">
            Company / Business
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Project Type & Budget */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-text">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select a type</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budgetRange" className="mb-1.5 block text-sm font-medium text-text">
            Budget Range
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            value={form.budgetRange}
            onChange={handleChange}
            className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select a range</option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label htmlFor="timeline" className="mb-1.5 block text-sm font-medium text-text">
          Timeline
        </label>
        <select
          id="timeline"
          name="timeline"
          value={form.timeline}
          onChange={handleChange}
          className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Select a timeline</option>
          {timelines.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-text">
          Tell us about your project <span className="text-error">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={50}
          rows={5}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-dark-border bg-dark px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Describe your project, goals, and any specific requirements (minimum 50 characters)..."
        />
      </div>

      {/* Preferred Contact */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text">
          Preferred Contact Method
        </label>
        <div className="flex gap-4">
          {["email", "phone"].map((method) => (
            <label key={method} className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="radio"
                name="contactMethod"
                value={method}
                checked={form.contactMethod === method}
                onChange={handleChange}
                className="accent-accent"
              />
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
