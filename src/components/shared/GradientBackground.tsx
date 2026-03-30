export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-accent/5 blur-[128px]" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-violet/5 blur-[128px]" />
    </div>
  );
}
