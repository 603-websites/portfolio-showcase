import { Github, Linkedin, User } from "lucide-react";
import Image from "next/image";

interface TeamCardProps {
  name: string;
  title: string;
  bio: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export default function TeamCard({
  name,
  title,
  bio,
  image,
  linkedinUrl,
  githubUrl,
}: TeamCardProps) {
  return (
    <div className="rounded-2xl border border-dark-border bg-dark-light p-6 transition hover:-translate-y-1">
      {/* Avatar */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-dark-lighter">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <User size={28} className="text-text-dim" />
        )}
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold text-text">{name}</h3>
      <p className="text-sm text-accent">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{bio}</p>

      {/* Social links */}
      {(linkedinUrl || githubUrl) && (
        <div className="mt-4 flex items-center gap-3">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-accent"
              aria-label={`${name} LinkedIn`}
            >
              <Linkedin size={18} />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted transition-colors hover:text-accent"
              aria-label={`${name} GitHub`}
            >
              <Github size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
