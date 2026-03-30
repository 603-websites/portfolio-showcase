import GradientBackground from "@/components/shared/GradientBackground";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GradientBackground />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
