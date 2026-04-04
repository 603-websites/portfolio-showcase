"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import SectionReveal from "@/components/marketing/SectionReveal";

const categories = ["All", "SaaS", "Portfolio"];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const router = useRouter();

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionReveal>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
          <p className="text-text-muted text-lg mb-12 max-w-2xl">
            Real websites we&apos;ve built for real businesses. Every project
            includes ongoing management and support.
          </p>
        </SectionReveal>

        <div className="flex gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === cat
                  ? "bg-accent text-white"
                  : "bg-dark-light text-text-muted hover:text-text border border-dark-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => router.push(`/projects/${project.slug}`)}
                className="bg-dark-light border border-dark-border rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform"
              >
                <div className="aspect-video bg-dark-lighter relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-3 right-3 bg-dark/80 text-text-muted text-xs px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-text mb-1">
                    {project.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-3">
                    {project.tagline}
                  </p>
                  {project.metrics[0] && (
                    <div className="text-xs text-text-dim">
                      {project.metrics[0].label}:{" "}
                      <span className="text-accent">
                        {project.metrics[0].value}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
