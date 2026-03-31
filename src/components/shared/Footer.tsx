import Link from "next/link";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import Logo from "@/components/shared/Logo";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const projectLinks = [
  { label: "Elite Car Detailing", href: "/projects/car-detailing" },
  { label: "Louis Sader Portfolio", href: "/projects/louissader-dev" },
  { label: "Trey Gonzalez Portfolio", href: "/projects/trey-gonzalez" },
  { label: "Logan Carter Portfolio", href: "/projects/logan-carter" },
  { label: "Aidan Carter Portfolio", href: "/projects/aidan-carter" },
];

const team = [
  {
    name: "Louis Sader",
    linkedin: "https://www.linkedin.com/in/louis-sader-a6a391287/",
    github: "https://github.com/louissader",
  },
  {
    name: "Logan Carter",
    linkedin: "https://www.linkedin.com/in/logan-carter-35h/",
    github: "https://github.com/Logan566C",
  },
  {
    name: "Michael Sader",
    label: "Co-Founder",
    linkedin: "https://www.linkedin.com/in/michael-sader/",
    github: null,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-light">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-text-muted">
              Building and managing websites for small businesses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text">Projects</h3>
            <ul className="space-y-3">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-text">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:louissader42@gmail.com"
                  className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
                >
                  <Mail size={14} />
                  louissader42@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+16032757513"
                  className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
                >
                  <Phone size={14} />
                  (603) 275-7513
                </a>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              {team.map((member) => (
                <div key={member.name}>
                  <p className="text-xs text-text-dim">
                    {member.name}
                    {member.label && (
                      <span className="ml-1 text-text-dim">
                        ({member.label})
                      </span>
                    )}
                  </p>
                  {(member.linkedin || member.github) && (
                    <div className="mt-1 flex items-center gap-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-muted transition-colors hover:text-accent"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Linkedin size={14} />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-muted transition-colors hover:text-accent"
                          aria-label={`${member.name} GitHub`}
                        >
                          <Github size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-xs text-text-dim">
            &copy; 2026 Website Upgraders. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-text-dim transition-colors hover:text-text-muted"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-text-dim transition-colors hover:text-text-muted"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
