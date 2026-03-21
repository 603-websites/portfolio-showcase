import { useState, useRef } from 'react'
import { Upload, X, Check, Link as LinkIcon, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import TextReveal from '../components/TextReveal'

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: 100,
    tagline: 'Perfect for getting started',
    features: [
      'Custom portfolio website',
      'Mobile responsive design',
      'Delivered within 7 days',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 200,
    tagline: 'Most popular choice',
    features: [
      'Everything in Starter',
      '6 months of edits & updates',
      'Content revisions included',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 250,
    tagline: 'Full year of support',
    features: [
      'Everything in Growth',
      '12 months of edits & updates',
      'Priority response time',
    ],
  },
]

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.docx'
const MAX_FILES = 10
const MAX_FILE_SIZE = 10 * 1024 * 1024

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Order() {
  const [selectedPkg, setSelectedPkg] = useState('growth')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [inspirationLink, setInspirationLink] = useState('')
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function addFiles(newFiles) {
    const valid = []
    const oversized = []
    Array.from(newFiles).forEach(f => {
      if (f.size > MAX_FILE_SIZE) oversized.push(f)
      else valid.push(f)
    })
    if (oversized.length) {
      setError(`${oversized.length} file(s) exceed the 10MB limit and were skipped.`)
    }
    setFiles(prev => [...prev, ...valid].slice(0, MAX_FILES))
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  async function uploadToSupabase(file) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `orders/${Date.now()}-${safeName}`

    const res = await fetch(`${supabaseUrl}/storage/v1/object/order-files/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: file,
    })

    if (!res.ok) throw new Error(`Failed to upload ${file.name}`)
    return `${supabaseUrl}/storage/v1/object/public/order-files/${path}`
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !description.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (description.trim().length < 20) {
      setError('Please write a more detailed description (at least 20 characters).')
      return
    }

    setLoading(true)
    try {
      let fileUrls = []
      if (files.length > 0) {
        fileUrls = await Promise.all(files.map(uploadToSupabase))
      }

      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selectedPkg,
          name: name.trim(),
          email: email.trim(),
          description: description.trim(),
          inspirationLink: inspirationLink.trim() || null,
          fileUrls,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      window.location.href = data.url
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const currentPrice = PACKAGES.find(p => p.id === selectedPkg)?.price

  return (
    <main className="pt-24 pb-24">
      <section className="max-w-4xl mx-auto px-6">
        <SectionReveal>
          <TextReveal as="h1" className="text-4xl md:text-6xl font-extrabold mb-4">
            Get Your Portfolio
          </TextReveal>
          <p className="text-xl text-text-muted mb-12">
            Pick a plan, tell us what you want, and we'll handle the rest.
          </p>
        </SectionReveal>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* 1. Package */}
          <SectionReveal delay={0.1}>
            <h2 className="text-lg font-bold text-text mb-4">1. Choose your package</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`relative text-left p-6 rounded-2xl border transition-all duration-200 ${
                    selectedPkg === pkg.id
                      ? 'border-accent bg-accent/5'
                      : 'border-dark-border bg-dark-light hover:border-accent/30'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-accent text-white whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-base font-bold text-text">{pkg.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{pkg.tagline}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      selectedPkg === pkg.id ? 'border-accent bg-accent' : 'border-dark-border'
                    }`}>
                      {selectedPkg === pkg.id && <Check size={12} className="text-white" />}
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-text mb-4">${pkg.price}</p>
                  <ul className="space-y-2">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                        <Check size={14} className="text-accent shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </SectionReveal>

          {/* 2. Your info */}
          <SectionReveal delay={0.15}>
            <h2 className="text-lg font-bold text-text mb-4">2. Your info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full bg-dark-lighter border border-dark-border rounded-xl px-4 py-3 text-text placeholder-text-dim focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full bg-dark-lighter border border-dark-border rounded-xl px-4 py-3 text-text placeholder-text-dim focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </SectionReveal>

          {/* 3. Description */}
          <SectionReveal delay={0.2}>
            <h2 className="text-lg font-bold text-text mb-4">3. Tell us what you want</h2>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe exactly what you're looking for. Include your industry, the tone you want, specific sections, anything important about you that should be featured..."
              rows={6}
              className="w-full bg-dark-lighter border border-dark-border rounded-xl px-4 py-3 text-text placeholder-text-dim focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <p className="text-xs text-text-dim mt-1">{description.length} characters</p>
          </SectionReveal>

          {/* 4. Inspiration link */}
          <SectionReveal delay={0.25}>
            <h2 className="text-lg font-bold text-text mb-1">
              4. Portfolio inspiration{' '}
              <span className="text-text-dim text-sm font-normal">(optional)</span>
            </h2>
            <p className="text-sm text-text-muted mb-4">Link to a portfolio or design that inspires you</p>
            <div className="relative">
              <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none" />
              <input
                type="url"
                value={inspirationLink}
                onChange={e => setInspirationLink(e.target.value)}
                placeholder="https://example.com/portfolio-you-like"
                className="w-full bg-dark-lighter border border-dark-border rounded-xl pl-10 pr-4 py-3 text-text placeholder-text-dim focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </SectionReveal>

          {/* 5. File upload */}
          <SectionReveal delay={0.3}>
            <h2 className="text-lg font-bold text-text mb-1">
              5. Upload your files{' '}
              <span className="text-text-dim text-sm font-normal">(optional)</span>
            </h2>
            <p className="text-sm text-text-muted mb-4">Resume, professional photo, personal photos — up to {MAX_FILES} files, 10MB each</p>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                dragging ? 'border-accent bg-accent/5' : 'border-dark-border hover:border-accent/40'
              }`}
            >
              <Upload size={32} className="mx-auto mb-3 text-text-dim" />
              <p className="text-text-muted font-medium">Drop files here or click to browse</p>
              <p className="text-sm text-text-dim mt-1">PDF, JPG, PNG, DOCX accepted</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES}
                className="hidden"
                onChange={e => { addFiles(e.target.files); e.target.value = '' }}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-dark-lighter border border-dark-border rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Upload size={14} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-text truncate">{file.name}</p>
                        <p className="text-xs text-text-dim">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="text-text-dim hover:text-error transition-colors ml-4 shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionReveal>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <SectionReveal delay={0.35}>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-semibold text-lg"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment — ${currentPrice}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
            <p className="text-center text-xs text-text-dim mt-3">
              Secured by Stripe · 100% upfront · No hidden fees
            </p>
          </SectionReveal>

        </form>
      </section>
    </main>
  )
}
