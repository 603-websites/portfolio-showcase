import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FolderSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-8">
          <FolderSearch size={40} className="text-accent" />
        </div>
        <h1 className="text-6xl font-extrabold text-text mb-4">404</h1>
        <h2 className="text-xl font-bold text-text mb-3">Page Not Found</h2>
        <p className="text-text-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            data-cursor="pointer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <Link
            to="/projects"
            data-cursor="pointer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-dark-border hover:border-text-dim text-text font-semibold rounded-full transition-colors"
          >
            View Projects
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
