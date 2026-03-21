import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'

export default function TeamCard({ name, title, bio, skills, image, linkedin, github, compact }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-dark-light border border-dark-border rounded-2xl hover:border-accent/30 transition-colors ${compact ? 'p-4 md:p-8' : 'p-8'}`}
    >
      {/* Photo */}
      <div className={`rounded-full mx-auto overflow-hidden bg-gradient-to-br from-accent to-violet ${compact ? 'w-20 h-20 md:w-32 md:h-32 mb-3 md:mb-6' : 'w-32 h-32 mb-6'}`}>
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>

      <h3 className={`font-bold text-text text-center ${compact ? 'text-base md:text-xl' : 'text-xl'}`}>{name}</h3>
      <p className={`text-accent text-center mt-1 ${compact ? 'text-xs md:text-sm mb-2 md:mb-4' : 'text-sm mb-4'}`}>{title}</p>
      <p className={`text-text-muted leading-relaxed text-center ${compact ? 'text-xs md:text-sm mb-3 md:mb-6' : 'text-sm mb-6'}`}>{bio}</p>

      {/* Social */}
      <div className="flex justify-center gap-4">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
            <Linkedin size={compact ? 16 : 20} />
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
            <Github size={compact ? 16 : 20} />
          </a>
        )}
      </div>
    </motion.div>
  )
}
