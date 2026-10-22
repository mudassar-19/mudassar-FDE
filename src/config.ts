// Single source of truth for all site content and branding.
// Replace the TODO-marked values before deploying publicly.

/**
 * The original template shipped with an encrypted, unlicensed 3D character
 * model (see LICENSE / analysis/REPORT.md §6 for why). Keep this `true` only
 * for local preview on this machine. Set to `false` (or simply delete
 * public/models/character.enc) before any public deploy — the app will then
 * render the code-generated low-poly workspace hero instead. See
 * src/components/Character/README.md for how to drop in your own GLB later.
 */
export const USE_ORIGINAL_MODEL = true;

export const config = {
  developer: {
    name: "Mudassar",
    fullName: "Mudassar Naeem",
    title: "Forward Deployed Engineer",
    description:
      "Developer and AI builder who also runs delivery: scoping work, leading a dev team, and shipping AI-powered products end to end.",
  },

  // Static "Currently:" line in the hero. Single string — edit this one
  // value to change it everywhere (hero, loading marquee, title/meta are
  // kept in sync by hand in index.html since that file isn't template-driven).
  currentRole: "Forward Deployed Engineer",

  // Drop your real PDF at public/resume.pdf — this filename is the only
  // thing referenced in code, so swapping the file is enough.
  resumeUrl: "/resume.pdf",

  contact: {
    email: "mudassarnaeem19@gmail.com",
    github: "https://github.com/mudassar-19",
    linkedin: "https://www.linkedin.com/in/mudassar-naeem-0b13b5269/",
    location: "Lahore, Pakistan",
  },

  loading: {
    brandLabel: "Mudassar Naeem",
  },

  about: {
    title: "About Me",
    description:
      "I build AI-powered products and lead the delivery that ships them. LLM integrations, RAG pipelines, computer vision, full-stack apps — and on the delivery side: scoping, client communication, budget pitching, and supervising a dev team.",
  },

  // "My Journey" timeline — newest first, Oct 2024 to Oct 2026.
  journey: [
    {
      badge: "NOW",
      title: "Forward Deployed Engineer",
      description:
        "Bridging the gap between core AI/ML development and client infrastructure. Deploying production-ready AI solutions, automating workflows, and ensuring seamless technical integration for end-to-end delivery.",
    },
    {
      badge: "JUL 2026",
      title: "Project to Delivery",
      description:
        "Requirement, scope & gap analysis, documentation & handoff, sign-off, stand-ups & QA, delivery & approval. Client communication from a Fiverr/Upwork inquiry through to order, budget-based pitching, and supervising the dev team — helping hands-on with the code whenever needed.",
    },
    {
      badge: "DEC 2025",
      title: "The boom",
      description:
        "150+ projects delivered with my team: AI-powered websites, ML fine-tuning, dataset collection, LLM integration, prompt engineering, RAG engines, e-commerce builds, and automations — including a WordPress hotel-site automation that builds a luxury site from a single listing link in 30–40 minutes.",
    },
    {
      badge: "FEB 2025",
      title: "AI / ML",
      description:
        "Moved into machine learning and LLM integrations — training and fine-tuning ML models and shipping the first AI-powered products.",
    },
    {
      badge: "OCT 2024",
      title: "Web development begins",
      description: "First full-stack projects.",
    },
  ],

  skills: {
    aiLlm: {
      title: "AI & LLM PRODUCTS",
      description: "Shipping AI products end to end",
      details:
        "Building LLM integrations, RAG engines, prompt pipelines, and computer-vision models — from dataset collection and fine-tuning through to a deployed product.",
      tools: [
        "Python",
        "LLM APIs",
        "RAG",
        "Prompt Engineering",
        "PyTorch",
        "Computer Vision",
        "Fine-Tuning",
        "LangChain",
        "Vector Search",
        "FastAPI",
      ],
    },
    delivery: {
      title: "DELIVERY & CLIENT LEAD",
      description: "From inquiry to sign-off",
      details:
        "Running the delivery side of 150+ projects: requirement & gap analysis, budget-based pitching, stand-ups & QA, and supervising a dev team through to client approval.",
      tools: [
        "Requirement Analysis",
        "Scope & Gap Analysis",
        "Client Communication",
        "Fiverr / Upwork",
        "Budget Pitching",
        "Team Supervision",
        "Stand-ups & QA",
        "Documentation & Handoff",
        "React",
        "Node.js",
      ],
    },
  },

  // Tech-stack pyramid (icons hotlinked from the MIT-licensed devicon CDN).
  techStack: [
    [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", url: "https://react.dev" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", url: "https://typescriptlang.org" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", url: "https://python.org" },
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", url: "https://nodejs.org" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", url: "https://nextjs.org" },
      { name: "WordPress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg", url: "https://wordpress.org" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    ],
    [
      { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", url: "https://fastapi.tiangolo.com" },
      { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", url: "https://expressjs.com" },
      { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", url: "https://php.net" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", url: "https://tailwindcss.com" },
      { name: "Hugging Face", icon: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg", url: "https://huggingface.co" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", url: "https://git-scm.com" },
    ],
    [
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", url: "https://mongodb.com" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", url: "https://postgresql.org" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", url: "https://mysql.com" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", url: "https://docker.com" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", url: "https://github.com" },
    ],
    [
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", url: "https://aws.amazon.com" },
      { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", url: "https://vercel.com" },
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", url: "https://linux.org" },
    ],
    [
      { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", url: "https://figma.com" },
    ],
  ],

  // Anonymized project case studies. Most of these shipped under NDA — no
  // client names, pricing, private screenshots, or code. Visuals are
  // generated abstract gradients/diagrams, not real product screenshots.
  projects: [
    {
      id: 1,
      title: "Oil Refinery Safety Incident Portal",
      category: "Enterprise / Safety",
      status: "Live in production",
      technologies: "React, Node.js, PostgreSQL, Role-based Access",
      problem: "Refinery staff had no centralized way to log, triage, and escalate safety incidents across shifts.",
      built: "A web portal for incident reporting, severity triage, and an audit-ready history, deployed for an industrial client.",
      result: "In daily use across refinery shifts to standardize incident response.",
      visual: { pattern: "grid", from: "#2b1a52", to: "#6d3bff" },
    },
    {
      id: 2,
      title: "Car Auction AI Buy-List Platform",
      category: "AI / Automotive",
      technologies: "Python, LLM APIs, Web Scraping, React",
      problem: "Buyers at car auctions had only minutes to decide which lots were worth bidding on.",
      built: "An AI platform that scores auction listings and generates a ranked buy-list with risk flags.",
      result: "Cut buy-list prep time from hours to minutes for auction teams.",
      visual: { pattern: "orbit", from: "#1a3a52", to: "#3bd0ff" },
    },
    {
      id: 3,
      title: "Date Palm Leaf & Fruit Scanner",
      category: "Computer Vision",
      technologies: "Python, PyTorch, OpenCV, Mobile Capture",
      problem: "Farmers needed an early way to spot disease and ripeness without manual inspection.",
      built: "A computer-vision model that scans leaf and fruit photos and flags disease and ripeness stage.",
      result: "Delivered as a working CV pipeline for agricultural scanning.",
      visual: { pattern: "scan", from: "#1a4a2e", to: "#3bff8f" },
    },
    {
      id: 4,
      title: "AI Product-Recommendation Chatbot",
      category: "AI / Retail",
      technologies: "LLM APIs, RAG, Node.js, Vector Search",
      problem: "Retail storefronts had generic search and no guided buying help.",
      built: "An AI chatbot embedded in retail storefronts that recommends products straight from the catalog.",
      result: "Deployed for multiple retail storefronts to lift product discovery.",
      visual: { pattern: "nodes", from: "#4a1a4e", to: "#ff6bd6" },
    },
    {
      id: 5,
      title: "Interactive Video Funnel Platform",
      category: "Marketing / Video",
      technologies: "React, Video.js, Node.js",
      problem: "Clients wanted a video-based funnel that adapts to viewer choices instead of a static landing page.",
      built: "A branching interactive video platform with clickable in-video decision points.",
      result: "Powers choice-driven video funnels for client campaigns.",
      visual: { pattern: "wave", from: "#4e2a1a", to: "#ffa23b" },
    },
    {
      id: 6,
      title: "AI Resume Builder",
      category: "AI / Productivity",
      technologies: "LLM APIs, Prompt Engineering, React",
      problem: "Job seekers struggled to tailor resumes quickly for each application.",
      built: "An AI resume builder that rewrites and formats resumes from a user's raw background and a target job post.",
      result: "Generates tailored, ATS-friendly resumes in minutes.",
      visual: { pattern: "grid", from: "#1a2a52", to: "#7a7bff" },
    },
    {
      id: 7,
      title: "Hotel Website Automation",
      category: "Automation / WordPress",
      technologies: "WordPress, PHP, Automation Scripts, LLM APIs",
      problem: "Hotel owners needed a polished site fast, without a slow manual build process.",
      built: "An automation pipeline that takes one listing link and builds a full luxury WordPress hotel site — pages, gallery, booking info — in 30–40 minutes.",
      result: "Cuts hotel site delivery from days to under an hour.",
      visual: { pattern: "orbit", from: "#52401a", to: "#ffd23b" },
    },
    {
      id: 8,
      title: "Dolby Atmos Compliance Tool",
      category: "Desktop / Audio",
      status: "In progress",
      technologies: "Python, Audio DSP, Desktop UI",
      problem: "Studios need to verify mixes meet Dolby Atmos delivery specs before submission.",
      built: "A desktop tool that analyzes mix files against Atmos compliance rules and reports violations.",
      result: "In active development for studio compliance checks.",
      visual: { pattern: "wave", from: "#2a1a52", to: "#b23bff" },
    },
    {
      id: 9,
      title: "Omnichannel AI Customer Service Platform",
      category: "AI / Support",
      status: "In progress",
      technologies: "LLM APIs, RAG, Node.js, WebSockets",
      problem: "Support teams juggle chat, email, and social DMs across separate tools.",
      built: "A unified AI-assisted support platform that triages and drafts replies across every channel.",
      result: "In active development to unify multi-channel support.",
      visual: { pattern: "nodes", from: "#1a5240", to: "#3bffd0" },
    },
    {
      id: 10,
      title: "IPTV + VPN App with AI Optimization",
      category: "Streaming / Networking",
      technologies: "React Native, VPN Protocols, ML-based Routing",
      problem: "Streaming quality degraded unpredictably across regions and networks.",
      built: "An IPTV + VPN client that uses AI to pick the fastest route and adjust stream quality in real time.",
      result: "Improves stream stability across variable networks.",
      visual: { pattern: "scan", from: "#521a2e", to: "#ff3b7a" },
    },
  ],

  ndaNote: "Many more projects were delivered under NDA — details on request.",
};
