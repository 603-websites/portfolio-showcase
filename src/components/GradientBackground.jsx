export default function GradientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-violet/5 rounded-full blur-[128px]" />
    </div>
  )
}
