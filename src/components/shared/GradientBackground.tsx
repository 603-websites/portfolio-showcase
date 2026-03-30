export default function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[150px]" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-violet/10 blur-[150px]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet/5 blur-[200px]" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-accent/4 blur-[180px]" />
    </div>
  );
}
