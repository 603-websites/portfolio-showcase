"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface Project {
  title: string;
  slug: string;
  tagline: string;
  image: string;
  liveLink: string;
  category: string;
}

interface ProjectBrowserProps {
  projects: Project[];
}

export default function ProjectBrowser({ projects }: ProjectBrowserProps) {
  const count = projects.length;
  const tripled = [...projects, ...projects, ...projects];

  // Start centered on middle copy
  const [activeIndex, setActiveIndex] = useState(count);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardWidth = 323; // md width
  const cardGap = 16;

  const goTo = useCallback((index: number, animate = true) => {
    setIsTransitioning(animate);
    setActiveIndex(index);
  }, []);

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const prev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Snap back to middle copy when reaching edges
  const handleTransitionEnd = useCallback(() => {
    if (activeIndex >= count * 2) {
      setIsTransitioning(false);
      setActiveIndex(activeIndex - count);
    } else if (activeIndex < count) {
      setIsTransitioning(false);
      setActiveIndex(activeIndex + count);
    }
  }, [activeIndex, count]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(next, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next, isPaused]);

  // Pause on tab hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const normalizedIndex = ((activeIndex % count) + count) % count;

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
    >
      {/* Track */}
      <div
        className={`flex gap-4 ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
        style={{
          transform: `translateX(calc(50% - ${activeIndex * (cardWidth + cardGap) + cardWidth / 2}px))`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {tripled.map((project, i) => {
          const isActive = i === activeIndex;
          return (
            <a
              key={`${project.slug}-${i}`}
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-[260px] md:w-[323px] shrink-0 rounded-2xl overflow-hidden border border-dark-border bg-dark-light transition-all duration-500 ${
                isActive ? "scale-105 opacity-100" : "scale-95 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-dark-lighter">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 260px, 323px"
                />
                {/* Category badge */}
                <span className="absolute right-3 top-3 rounded-full bg-dark/70 px-2.5 py-1 text-xs font-medium text-text backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-text">{project.title}</h3>
                <p className="mt-1 text-sm text-text-muted">
                  {project.tagline}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(count + i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              normalizedIndex === i
                ? "w-6 bg-accent"
                : "w-2 bg-dark-border hover:bg-text-dim"
            }`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
