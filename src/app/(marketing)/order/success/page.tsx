"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "growth";
  const sessionId = searchParams.get("session_id") || "";

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-lg mx-auto px-4 text-center">
        <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Payment Confirmed!</h1>
        <p className="text-text-muted mb-8">
          Your subscription is set up. Create your account to access your
          dashboard and get started.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href={`/signup?plan=${plan}&session_id=${sessionId}`}
            className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 font-medium transition"
          >
            Create Account
          </Link>
          <Link
            href="/"
            className="text-text-muted hover:text-text transition text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
