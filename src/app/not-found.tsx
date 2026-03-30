import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="w-16 h-16 text-accent mb-6" />
      <p className="text-8xl font-bold text-text mb-4">404</p>
      <h1 className="text-2xl font-semibold text-text mb-2">Page Not Found</h1>
      <p className="text-text-muted mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 font-medium transition"
        >
          Back to Home
        </Link>
        <Link
          href="/projects"
          className="border border-dark-border text-text-muted hover:text-text rounded-lg px-6 py-3 font-medium transition"
        >
          View Projects
        </Link>
      </div>
    </div>
  );
}
