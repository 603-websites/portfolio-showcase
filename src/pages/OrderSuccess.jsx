import { CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionReveal from '../components/SectionReveal'

const NEXT_STEPS = [
  "You'll receive a confirmation email shortly.",
  "We'll review your submission and reach out within 24 hours.",
  "We'll hop on a quick call to align on details if needed.",
  "Your portfolio will be built and delivered on time, to spec.",
]

export default function OrderSuccess() {
  return (
    <main className="pt-24 pb-24 min-h-[80vh] flex items-center">
      <section className="max-w-2xl mx-auto px-6 text-center w-full">
        <SectionReveal>
          <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} className="text-success" />
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-text mb-4">
            You're all set!
          </h1>
          <p className="text-xl text-text-muted mb-10">
            Payment confirmed. We'll reach out to your email within 24 hours to kick things off.
          </p>

          <div className="bg-dark-light border border-dark-border rounded-2xl p-6 text-left mb-8">
            <h3 className="text-base font-bold text-text mb-4">What happens next</h3>
            <ol className="space-y-3">
              {NEXT_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <Link
            to="/"
            data-cursor="pointer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark-light border border-dark-border text-text-muted hover:text-text hover:border-accent/30 transition-colors text-sm font-medium"
          >
            Back to home
          </Link>
        </SectionReveal>
      </section>
    </main>
  )
}
