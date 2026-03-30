import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TeamCard from "@/components/marketing/TeamCard";
import SectionReveal from "@/components/marketing/SectionReveal";

export const metadata: Metadata = {
  title: "About | Website Upgraders",
  description:
    "Meet the team behind Website Upgraders. We build and manage professional websites for small businesses.",
};

const team = [
  {
    name: "Louis Sader",
    title: "Co-Founder",
    bio: "Software developer with professional experience at startups and enterprise companies. Passionate about building fast, accessible websites that help businesses grow.",
    image: "/images/team/louis.jpg",
    linkedinUrl: "https://linkedin.com/in/louis-sader-a6a391287/",
    githubUrl: "https://github.com/louissader",
  },
  {
    name: "Logan Carter",
    title: "Co-Founder",
    bio: "Engineering student at CU Boulder (Class of 2027), Dean's List, Honors College. Brings a unique blend of engineering discipline and creative problem-solving.",
    image: "/images/team/logan.jpg",
    linkedinUrl: "https://linkedin.com/in/logan-carter-35h/",
    githubUrl: "https://github.com/Logan566C",
  },
  {
    name: "Michael Sader",
    title: "Co-Founder",
    bio: "District Manager at ADP with expertise in sales, business development, and CRM solutions. High Point University graduate (Marketing, Minor in Sales). Brings real-world client acquisition and relationship management experience to the team.",
    image: "/images/team/michael.jpg",
    linkedinUrl: "https://linkedin.com/in/michael-sader/",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet the Team Behind{" "}
              <span className="bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
                Website Upgraders
              </span>
            </h1>
            <p className="text-text-muted text-lg">
              We&apos;re a small team of developers who believe every business
              deserves a great website without the enterprise price tag or the
              hassle of managing it yourself.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {team.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Want to work with us?</h2>
            <p className="text-text-muted mb-8">
              Whether you need a new website or want to improve your existing
              one, we&apos;d love to chat.
            </p>
            <Link
              href="/contact"
              className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 font-medium transition inline-flex items-center gap-2"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
