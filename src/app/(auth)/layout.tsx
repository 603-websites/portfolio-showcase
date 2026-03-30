import GradientBackground from "@/components/shared/GradientBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GradientBackground />
      <div className="min-h-screen flex items-center justify-center px-4">
        {children}
      </div>
    </>
  );
}
