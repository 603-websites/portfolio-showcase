export default function GradientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  )
}
