"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, ShieldAlert } from "lucide-react";

interface SessionExpiredModalProps {
  /** Pass true to show the modal */
  show: boolean;
}

/**
 * Full-screen modal overlay shown when a Supabase call returns an auth error.
 * The Sign In button redirects to /login?next=<current-path> so the user
 * lands back on the page they were on after re-authenticating.
 */
export default function SessionExpiredModal({ show }: SessionExpiredModalProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Prevent scrolling behind the overlay
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  const handleSignIn = () => {
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dark-light border border-dark-border rounded-2xl p-8 w-full max-w-sm mx-4 text-center space-y-5 shadow-2xl">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-amber/10 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-amber" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-text">Session Expired</h2>
          <p className="text-text-muted text-sm mt-2 leading-relaxed">
            Your session has expired. Please sign in again to continue where you
            left off.
          </p>
        </div>

        <button
          onClick={handleSignIn}
          className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </button>
      </div>
    </div>
  );
}
