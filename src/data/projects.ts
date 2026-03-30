export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  category: "SaaS" | "Portfolio";
  description: string;
  image: string;
  gallery: string[];
  liveLink: string;
  githubLink: string;
  launchDate: string;
  buildTime: string;
  team: string;
  status: string;
  techStack: string[];
  problem: string;
  solution: string;
  metrics: ProjectMetric[];
  features: string[];
  results: string[];
  lessons: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "car-detailing",
    title: "Elite Car Detailing",
    tagline: "A luxury detailing business site with online booking and service showcases.",
    description: "A modern booking and showcase website for a luxury car detailing business.",
    category: "SaaS",
    image: "/images/projects/car-detailing.jpg",
    gallery: ["/images/projects/car-detailing.jpg"],
    liveLink: "https://elite-detailing-website.vercel.app",
    githubLink: "https://github.com/603-websites/elite-car-detailing",
    launchDate: "January 2026",
    buildTime: "2 weeks",
    team: "Louis Sader & Logan Carter",
    status: "Live",
    techStack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    problem:
      "A local detailing business needed a professional online presence to showcase their premium services and attract new clients.",
    solution:
      "We built a fast, visually stunning website with service breakdowns, a gallery, and clear calls to action that convert visitors into customers.",
    metrics: [
      { label: "Performance Score", value: "98/100" },
      { label: "Load Time", value: "1.2s" },
      { label: "Mobile Score", value: "96/100" },
      { label: "Pages", value: "5" },
    ],
    features: [
      "Responsive design optimized for all devices",
      "Service tier breakdown with pricing",
      "Photo gallery with before/after showcases",
      "Contact form with email integration",
      "SEO-optimized for local search",
    ],
    results: [
      "Increased online inquiries by 3x within the first month",
      "Achieved top-3 local search ranking for detailing services",
      "Reduced bounce rate to under 30%",
    ],
    lessons: [
      "High-quality images are essential for service-based businesses",
      "Clear pricing builds trust and reduces tire-kicker inquiries",
      "Local SEO drives the majority of traffic for small businesses",
    ],
  },
  {
    id: 2,
    slug: "louissader-dev",
    title: "Louis Sader Portfolio",
    tagline: "A developer portfolio showcasing projects, experience, and technical writing.",
    description: "A personal portfolio showcasing software development projects and professional experience.",
    category: "Portfolio",
    image: "/images/projects/louissader-dev.jpg",
    gallery: ["/images/projects/louissader-dev.jpg"],
    liveLink: "https://louissader.vercel.app",
    githubLink: "https://github.com/603-websites/louis-sader",
    launchDate: "December 2025",
    buildTime: "1 week",
    team: "Louis Sader",
    status: "Live",
    techStack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    problem:
      "Needed a professional developer portfolio to showcase projects and attract freelance clients.",
    solution:
      "A clean, dark-themed portfolio with smooth animations, project case studies, and an integrated contact form.",
    metrics: [
      { label: "Performance Score", value: "99/100" },
      { label: "Load Time", value: "0.8s" },
      { label: "Lighthouse SEO", value: "100" },
      { label: "Projects Shown", value: "6" },
    ],
    features: [
      "Animated hero with typewriter effect",
      "Project cards with live demo links",
      "Experience timeline",
      "Dark/light mode toggle",
      "Contact form with validation",
    ],
    results: [
      "Generated multiple freelance leads within the first week",
      "Perfect Lighthouse scores across all categories",
      "Serves as the flagship template for portfolio clients",
    ],
    lessons: [
      "Simplicity and speed are more important than flashy effects",
      "A clear call-to-action above the fold drives conversions",
      "Portfolio sites should load in under 1 second",
    ],
  },
  {
    id: 5,
    slug: "trey-gonzalez",
    title: "Trey Gonzalez Portfolio",
    tagline: "A personal portfolio for an aspiring professional with a clean, modern design.",
    description: "A vibrant portfolio website for a creative professional looking to stand out.",
    category: "Portfolio",
    image: "/images/projects/trey-gonzalez.jpg",
    gallery: ["/images/projects/trey-gonzalez.jpg"],
    liveLink: "https://trey-gonzalez-portfolio.vercel.app",
    githubLink: "https://github.com/Logan566C/trey-gonzalez-portfolio",
    launchDate: "February 2026",
    buildTime: "1 week",
    team: "Louis Sader & Logan Carter",
    status: "Live",
    techStack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    problem:
      "A college student needed a professional portfolio to stand out in internship and job applications.",
    solution:
      "We created a polished, responsive portfolio highlighting skills, projects, and accomplishments with a personal touch.",
    metrics: [
      { label: "Performance Score", value: "97/100" },
      { label: "Load Time", value: "1.0s" },
      { label: "Mobile Score", value: "95/100" },
      { label: "Sections", value: "4" },
    ],
    features: [
      "Responsive mobile-first design",
      "About section with personal brand story",
      "Skills and experience overview",
      "Contact integration",
    ],
    results: [
      "Client received positive feedback from recruiters",
      "Portfolio used in multiple job applications",
      "Clean design serves as a conversation starter in interviews",
    ],
    lessons: [
      "Personal branding matters as much as technical content",
      "Keep portfolios focused: quality over quantity",
      "Fast iteration with client feedback leads to better outcomes",
    ],
  },
  {
    id: 3,
    slug: "logan-carter",
    title: "Logan Carter Portfolio",
    tagline: "An engineering student's portfolio showcasing technical projects and leadership.",
    description: "A professional portfolio for an engineering student and co-founder of Website Upgraders.",
    category: "Portfolio",
    image: "/images/projects/logan-carter.jpg",
    gallery: ["/images/projects/logan-carter.jpg"],
    liveLink: "https://logan-carter-portfolio.vercel.app",
    githubLink: "https://github.com/603-websites/logan-carter",
    launchDate: "January 2026",
    buildTime: "1 week",
    team: "Louis Sader & Logan Carter",
    status: "Live",
    techStack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    problem:
      "An engineering student wanted a portfolio that balances technical depth with approachability.",
    solution:
      "A modern portfolio with project showcases, leadership highlights, and a clean professional aesthetic.",
    metrics: [
      { label: "Performance Score", value: "98/100" },
      { label: "Load Time", value: "0.9s" },
      { label: "Lighthouse SEO", value: "100" },
      { label: "Projects Shown", value: "4" },
    ],
    features: [
      "Project showcase with descriptions and links",
      "Education and honors section",
      "Responsive across all devices",
      "Fast loading with optimized assets",
    ],
    results: [
      "Strengthened professional brand for internship applications",
      "Achieved near-perfect Lighthouse scores",
      "Serves as a living resume for networking events",
    ],
    lessons: [
      "Engineering portfolios benefit from clear project descriptions",
      "Academic achievements should be prominently featured",
      "A personal website sets you apart from other applicants",
    ],
  },
  {
    id: 4,
    slug: "aidan-carter",
    title: "Aidan Carter Portfolio",
    tagline: "A minimal portfolio site for a creative professional.",
    description: "A minimalist portfolio website with a focus on clean design and fast performance.",
    category: "Portfolio",
    image: "/images/projects/aidan-carter.jpg",
    gallery: ["/images/projects/aidan-carter.jpg"],
    liveLink: "https://aidan-carter-portfolio.vercel.app",
    githubLink: "https://github.com/Logan566C/aidan-carter-portfolio",
    launchDate: "February 2026",
    buildTime: "1 week",
    team: "Louis Sader & Logan Carter",
    status: "Live",
    techStack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    problem:
      "A young professional needed a simple but effective online portfolio to establish their personal brand.",
    solution:
      "We delivered a clean, minimal portfolio that loads fast and presents content clearly without distractions.",
    metrics: [
      { label: "Performance Score", value: "99/100" },
      { label: "Load Time", value: "0.7s" },
      { label: "Mobile Score", value: "98/100" },
      { label: "Sections", value: "3" },
    ],
    features: [
      "Minimalist design with strong typography",
      "Fully responsive layout",
      "Optimized images and lazy loading",
      "Clean navigation",
    ],
    results: [
      "Client praised the clean, professional look",
      "Fastest loading portfolio in our collection",
      "Demonstrates that simplicity is effective",
    ],
    lessons: [
      "Less is more: minimal portfolios perform best",
      "Typography and spacing carry the design when visuals are minimal",
      "Deliver fast, iterate based on feedback",
    ],
  },
];

export default projects;
