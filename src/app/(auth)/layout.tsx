import GradientBackground from "@/components/shared/GradientBackground";
import Navbar from "@/components/shared/Navbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GradientBackground />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        {children}
      </div>
    </>
  );
}
