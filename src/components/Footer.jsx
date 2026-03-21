import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, Phone } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

const projectLinks = [
  { to: '/projects/car-detailing', label: 'Elite Car Detailing' },
  { to: '/projects/louissader-dev', label: 'Louis Sader Portfolio' },
  { to: '/projects/trey-gonzalez', label: 'Trey Gonzalez Portfolio' },
  { to: '/projects/logan-carter', label: 'Logan Carter Portfolio' },
  { to: '/projects/aidan-carter', label: 'Aidan Carter Portfolio' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-light border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
              S&C
            </span>
            <p className="mt-4 text-text-muted text-sm leading-relaxed">
              We make business and portfolio websites that look great, load fast, and help you get more customers.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-text-muted hover:text-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">Projects</h4>
            <ul className="space-y-3">
              {projectLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-text-muted hover:text-text transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">Connect</h4>
            <div className="space-y-3">
              <a href="mailto:louissader42@gmail.com" className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
                <Mail size={16} /> louissader42@gmail.com
              </a>
              <a href="tel:+16032757513" className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
                <Phone size={16} /> (603) 275-7513
              </a>
              <div className="space-y-3 pt-2">
                <div>
                  <p className="text-xs text-text-dim mb-1.5">Louis Sader</p>
                  <div className="flex gap-3">
                    <a href="https://www.linkedin.com/in/louis-sader-a6a391287/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
                      <Linkedin size={20} />
                    </a>
                    <a href="https://github.com/louissader" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-dim mb-1.5">Logan Carter</p>
                  <div className="flex gap-3">
                    <a href="https://www.linkedin.com/in/logan-carter-35h/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
                      <Linkedin size={20} />
                    </a>
                    <a href="https://github.com/Logan566C" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-dim">
            &copy; 2026 Sader & Carter Web Development. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-text-dim hover:text-text-muted transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-text-dim hover:text-text-muted transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
