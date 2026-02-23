import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const projectTypes = ['Booking Platform', 'Custom Web App', 'SaaS Template', 'Other']
const budgetRanges = ['Under $5k', '$5k - $15k', '$15k - $30k', '$30k+', 'Not sure yet']
const timelines = ['ASAP (1-2 weeks)', '1-2 months', '3+ months', 'Flexible']
const contactMethods = ['Email', 'Phone', 'Schedule a call']

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', projectType: '', budgetRange: '',
    timeline: '', description: '', contactMethod: 'Email', phone: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.projectType) e.projectType = 'Select a project type'
    if (!form.description.trim()) e.description = 'Description is required'
    else if (form.description.trim().length < 50) e.description = 'At least 50 characters'
    if (form.contactMethod === 'Phone' && !form.phone.trim()) e.phone = 'Phone number required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', company: '', projectType: '', budgetRange: '', timeline: '', description: '', contactMethod: 'Email', phone: '' })
    } catch {
      setStatus('error')
    }
  }

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  const inputClass = (field) =>
    `w-full bg-dark-lighter border ${errors[field] ? 'border-error' : 'border-dark-border'} rounded-lg px-4 py-3 text-sm text-text placeholder-text-dim focus:border-accent focus:outline-none transition-colors`

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
        <CheckCircle size={48} className="text-success mx-auto mb-4" />
        <h3 className="text-xl font-bold text-text mb-2">Thanks for reaching out!</h3>
        <p className="text-text-muted">We'll get back to you within 24 hours.</p>
        <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-accent hover:text-accent-hover transition-colors" data-cursor="pointer">
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Name *</label>
          <input type="text" value={form.name} onChange={update('name')} placeholder="Your name" className={inputClass('name')} />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-2">Email *</label>
          <input type="email" value={form.email} onChange={update('email')} placeholder="you@company.com" className={inputClass('email')} />
          {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">Company / Business</label>
        <input type="text" value={form.company} onChange={update('company')} placeholder="Optional" className={inputClass('company')} />
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Project Type *</label>
          <select value={form.projectType} onChange={update('projectType')} className={inputClass('projectType')}>
            <option value="">Select...</option>
            {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.projectType && <p className="text-xs text-error mt-1">{errors.projectType}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-2">Budget Range</label>
          <select value={form.budgetRange} onChange={update('budgetRange')} className={inputClass('budgetRange')}>
            <option value="">Select...</option>
            {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text mb-2">Timeline</label>
          <select value={form.timeline} onChange={update('timeline')} className={inputClass('timeline')}>
            <option value="">Select...</option>
            {timelines.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">Project Description *</label>
        <textarea
          value={form.description} onChange={update('description')} rows={5}
          placeholder="Tell us about what you're building... (min 50 characters)"
          className={inputClass('description')}
        />
        {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
        <p className="text-xs text-text-dim mt-1">{form.description.length}/50 characters minimum</p>
      </div>

      {/* Contact Method */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">Preferred Contact Method</label>
        <div className="flex gap-6">
          {contactMethods.map(m => (
            <label key={m} className="flex items-center gap-2 text-sm text-text-muted" data-cursor="pointer">
              <input
                type="radio" name="contactMethod" value={m}
                checked={form.contactMethod === m}
                onChange={update('contactMethod')}
                className="accent-accent"
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Phone (conditional) */}
      {form.contactMethod === 'Phone' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <label className="block text-sm font-medium text-text mb-2">Phone Number *</label>
          <input type="tel" value={form.phone} onChange={update('phone')} placeholder="(555) 555-5555" className={inputClass('phone')} />
          {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
        </motion.div>
      )}

      {/* Error message */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-error bg-error/10 px-4 py-3 rounded-lg">
          <AlertCircle size={16} />
          Something went wrong. Please try again or email us at louissader42@gmail.com
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          data-cursor="pointer"
          className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
        >
          {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Message'}
        </button>
        <button
          type="button"
          data-cursor="pointer"
          onClick={() => {
            setForm({ name: '', email: '', company: '', projectType: '', budgetRange: '', timeline: '', description: '', contactMethod: 'Email', phone: '' })
            setErrors({})
          }}
          className="px-6 py-3 border border-dark-border text-text-muted hover:text-text rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
