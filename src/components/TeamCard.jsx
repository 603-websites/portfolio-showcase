import { motion } from 'framer-motion'
import { Github, Linkedin } from 'lucide-react'

export default function TeamCard({ name, title, bio, skills, image, linkedin, github }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-dark-light border border-dark-border rounded-2xl p-8 hover:border-accent/30 transition-colors"
    >
      {/* Photo */}
      <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden bg-gradient-to-br from-accent to-violet">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
            {name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-text text-center">{name}</h3>
      <p className="text-sm text-accent text-center mt-1 mb-4">{title}</p>
      <p className="text-sm text-text-muted leading-relaxed text-center mb-6">{bio}</p>

      {/* Social */}
      <div className="flex justify-center gap-4">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" data-cursor="pointer">
            <Linkedin size={20} />
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" data-cursor="pointer">
            <Github size={20} />
          </a>
        )}
      </div>
    </motion.div>
  )
}
