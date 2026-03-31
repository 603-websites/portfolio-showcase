import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-accent">
        <span className="text-base font-extrabold leading-none text-white">
          W
        </span>
      </div>
      <span className="text-lg font-bold text-text">
        Website
        <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
          Upgraders
        </span>
      </span>
    </Link>
  );
}
