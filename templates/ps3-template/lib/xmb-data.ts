// ── Types ──────────────────────────────────────────────────────────────
export type UserProfile = "recruiter" | "engineer" | "stranger"

export interface XMBItem {
  id: string
  label: string
  subtitle?: string
  description?: string
  icon?: string
  date?: string
  tags?: string[]
  links?: { label: string; url: string }[]
  image?: string
  profilePriority?: UserProfile[]
}

export interface XMBCategory {
  id: string
  label: string
  icon: string
  items: XMBItem[]
}

// ── Portfolio Data ─────────────────────────────────────────────────────
export const CATEGORIES: XMBCategory[] = [
  {
    id: "users",
    label: "Users",
    icon: "users",
    items: [
      {
        id: "recruiter",
        label: "Recruiter",
        subtitle: "Hiring Manager / Talent Scout",
        description:
          "View my production-ready applications, commercial projects, and collaborative team work.",
        icon: "briefcase",
      },
      {
        id: "engineer",
        label: "Engineer",
        subtitle: "Fellow Developer / Tech Lead",
        description:
          "Explore technical deep-dives, system design patterns, and algorithmic solutions.",
        icon: "code",
      },
      {
        id: "stranger",
        label: "Internet Stranger",
        subtitle: "Curious Visitor",
        description:
          "Check out my creative experiments, fun side-projects, and weird prototypes.",
        icon: "globe",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: "gamepad",
    items: [
      {
        id: "proj-commerce",
        label: "ShopStream",
        subtitle: "Full-Stack E-Commerce Platform",
        description:
          "A production-grade storefront with real-time inventory, Stripe payments, and an admin dashboard. Built for scale with edge caching and optimistic UI updates.",
        date: "2025",
        tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind"],
        links: [
          { label: "GitHub", url: "#" },
          { label: "Live Demo", url: "#" },
        ],
        profilePriority: ["recruiter"],
      },
      {
        id: "proj-collab",
        label: "SyncBoard",
        subtitle: "Real-Time Collaboration Tool",
        description:
          "A multiplayer whiteboard app with CRDTs for conflict-free editing, WebSocket sync, and infinite canvas. Supports drawing, sticky notes, and live cursors.",
        date: "2025",
        tags: ["React", "WebSockets", "CRDT", "Canvas API", "Node.js"],
        links: [
          { label: "GitHub", url: "#" },
          { label: "Live Demo", url: "#" },
        ],
        profilePriority: ["recruiter", "engineer"],
      },
      {
        id: "proj-compiler",
        label: "TinyLang",
        subtitle: "Custom Programming Language",
        description:
          "A toy language with a hand-written lexer, recursive descent parser, and tree-walk interpreter. Supports closures, first-class functions, and pattern matching.",
        date: "2024",
        tags: ["Rust", "Compilers", "AST", "WASM"],
        links: [{ label: "GitHub", url: "#" }],
        profilePriority: ["engineer"],
      },
      {
        id: "proj-generative",
        label: "PixelDrift",
        subtitle: "Generative Art Engine",
        description:
          "A creative coding playground that generates algorithmic artwork using noise fields, particle systems, and emergent patterns. Every refresh is unique.",
        date: "2024",
        tags: ["Canvas", "WebGL", "GLSL", "Creative Coding"],
        links: [
          { label: "GitHub", url: "#" },
          { label: "Gallery", url: "#" },
        ],
        profilePriority: ["stranger"],
      },
      {
        id: "proj-cli",
        label: "DevForge CLI",
        subtitle: "Developer Toolchain",
        description:
          "An opinionated CLI that scaffolds full-stack projects with pre-configured linting, testing, CI/CD, and deployment pipelines. Used by 500+ developers.",
        date: "2024",
        tags: ["Go", "CLI", "Docker", "GitHub Actions"],
        links: [{ label: "GitHub", url: "#" }],
        profilePriority: ["engineer", "recruiter"],
      },
      {
        id: "proj-game",
        label: "VoidRunner",
        subtitle: "Browser-Based Roguelike",
        description:
          "A procedurally-generated dungeon crawler built entirely in the browser. Features permadeath, loot tables, and ASCII-rendered combat in a cyberpunk setting.",
        date: "2023",
        tags: ["TypeScript", "Canvas", "Procedural Gen", "Game Dev"],
        links: [
          { label: "GitHub", url: "#" },
          { label: "Play", url: "#" },
        ],
        profilePriority: ["stranger"],
      },
      {
        id: "proj-ai",
        label: "ContextPilot",
        subtitle: "AI-Powered Code Assistant",
        description:
          "A VS Code extension that provides context-aware code suggestions by analyzing your entire codebase graph. Uses local LLMs for privacy-first AI assistance.",
        date: "2025",
        tags: ["TypeScript", "VS Code API", "LLM", "RAG"],
        links: [{ label: "GitHub", url: "#" }],
        profilePriority: ["engineer", "recruiter"],
      },
    ],
  },
  {
    id: "tech",
    label: "Tech Stack",
    icon: "cpu",
    items: [
      {
        id: "tech-languages",
        label: "Languages",
        subtitle: "TypeScript, JavaScript, Rust, Go, Python",
        description:
          "Proficient across multiple paradigms. TypeScript is my daily driver; Rust and Go for systems-level work; Python for scripting and ML pipelines.",
        tags: ["TypeScript", "JavaScript", "Rust", "Go", "Python"],
      },
      {
        id: "tech-frontend",
        label: "Frontend",
        subtitle: "React, Next.js, Tailwind, Three.js",
        description:
          "Expert in modern component architectures, server components, streaming SSR, and creative WebGL experiences.",
        tags: ["React", "Next.js", "Tailwind CSS", "Three.js", "Framer Motion"],
      },
      {
        id: "tech-backend",
        label: "Backend",
        subtitle: "Node.js, PostgreSQL, Redis, GraphQL",
        description:
          "Building scalable APIs, real-time systems, and data pipelines. Comfortable with both SQL and NoSQL, caching strategies, and message queues.",
        tags: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "Prisma"],
      },
      {
        id: "tech-devops",
        label: "DevOps & Cloud",
        subtitle: "Docker, AWS, Vercel, GitHub Actions",
        description:
          "Infrastructure as code, CI/CD pipelines, containerization, and cloud-native deployments. Focused on developer experience and deployment velocity.",
        tags: ["Docker", "AWS", "Vercel", "Terraform", "GitHub Actions"],
      },
      {
        id: "tech-tools",
        label: "Tools & Practices",
        subtitle: "Git, Testing, Accessibility, Performance",
        description:
          "Test-driven development, web accessibility (WCAG 2.1), performance optimization, and clean architecture principles.",
        tags: ["Git", "Jest", "Playwright", "Lighthouse", "a11y"],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    icon: "user",
    items: [
      {
        id: "about-bio",
        label: "Bio",
        subtitle: "Full-Stack Developer",
        description:
          "I'm a full-stack developer who loves building tools that make people's lives easier. When I'm not shipping features, I'm exploring creative coding, contributing to open source, or diving into language design. I believe great software is invisible -- it just works.",
      },
      {
        id: "about-contact",
        label: "Contact",
        subtitle: "Get in touch",
        description:
          "Email: hello@developer.dev\nLinkedIn: linkedin.com/in/developer\nTwitter: @developer",
        links: [
          { label: "Email", url: "mailto:hello@developer.dev" },
          { label: "LinkedIn", url: "#" },
          { label: "Twitter", url: "#" },
        ],
      },
      {
        id: "about-resume",
        label: "Download Resume",
        subtitle: "Install Package File (.pdf)",
        description:
          "Download my full resume with work history, education, certifications, and references.",
        links: [{ label: "Download PDF", url: "#" }],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    items: [
      {
        id: "settings-sound",
        label: "Sound Effects",
        subtitle: "Toggle navigation sounds",
        description: "Enable or disable PS3-style sound effects during navigation.",
      },
      {
        id: "settings-scanlines",
        label: "CRT Scanlines",
        subtitle: "Toggle CRT overlay effect",
        description: "Add a subtle scanline overlay for retro CRT monitor authenticity.",
      },
      {
        id: "settings-particles",
        label: "Wave Intensity",
        subtitle: "Adjust background animation",
        description: "Control the intensity of the background wave particle effect.",
      },
    ],
  },
]

export function getProjectsForProfile(profile: UserProfile): XMBItem[] {
  const projectsCat = CATEGORIES.find((c) => c.id === "projects")
  if (!projectsCat) return []
  return [...projectsCat.items].sort((a, b) => {
    const aIdx = a.profilePriority?.indexOf(profile) ?? -1
    const bIdx = b.profilePriority?.indexOf(profile) ?? -1
    const aScore = aIdx >= 0 ? aIdx : 999
    const bScore = bIdx >= 0 ? bIdx : 999
    return aScore - bScore
  })
}
