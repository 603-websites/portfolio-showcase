import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowLeft, ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/projects";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} | Website Upgraders`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text text-sm mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        {/* Hero */}
        <div className="rounded-2xl overflow-hidden mb-12 aspect-video bg-dark-light">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <span className="text-accent text-sm font-medium">
                {project.category}
              </span>
              <h1 className="text-4xl font-bold mt-2 mb-4">{project.title}</h1>
              <p className="text-text-muted text-lg">{project.description}</p>
            </div>

            {/* Problem / Solution */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-dark-light border border-dark-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3">The Challenge</h3>
                <p className="text-text-muted text-sm">{project.problem}</p>
              </div>
              <div className="bg-dark-light border border-dark-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3">Our Solution</h3>
                <p className="text-text-muted text-sm">{project.solution}</p>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="bg-dark-light border border-dark-border rounded-xl p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-accent">{m.value}</p>
                    <p className="text-text-muted text-sm mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold mb-6">Key Features</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-text-muted"
                  >
                    <Check className="w-4 h-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Results */}
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Results &amp; Impact
              </h3>
              <ul className="space-y-3">
                {project.results.map((r, i) => (
                  <li key={r} className="flex items-start gap-3 text-text-muted">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-sm font-medium flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lessons */}
            <div>
              <h3 className="text-xl font-semibold mb-6">What We Learned</h3>
              <ul className="space-y-3">
                {project.lessons.map((l) => (
                  <li
                    key={l}
                    className="text-text-muted pl-4 border-l-2 border-accent/30"
                  >
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-dark-light border border-dark-border rounded-2xl p-6 space-y-4 sticky top-28">
              <div>
                <p className="text-text-dim text-xs uppercase tracking-wider mb-1">
                  Launched
                </p>
                <p className="text-text font-medium">{project.launchDate}</p>
              </div>
              <div>
                <p className="text-text-dim text-xs uppercase tracking-wider mb-1">
                  Build Time
                </p>
                <p className="text-text font-medium">{project.buildTime}</p>
              </div>
              <div>
                <p className="text-text-dim text-xs uppercase tracking-wider mb-1">
                  Team
                </p>
                <p className="text-text font-medium">{project.team}</p>
              </div>
              <div>
                <p className="text-text-dim text-xs uppercase tracking-wider mb-2">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-dark-lighter border border-dark-border rounded-full px-3 py-1 text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <hr className="border-dark-border" />
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-lg px-4 py-3 font-medium transition w-full"
              >
                <ExternalLink className="w-4 h-4" /> Visit Live Site
              </a>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-dark-border text-text-muted hover:text-text rounded-lg px-4 py-3 font-medium transition w-full"
              >
                <Github className="w-4 h-4" /> View Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
