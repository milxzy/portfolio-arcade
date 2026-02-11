export type Channel = {
  id: string
  title: string
  subtitle?: string
  icon: string
  color: string
  textColor: string
  row: number
  col: number
}

export const channels: Channel[] = [
  // Row 1 - User Selection
  {
    id: "recruiter",
    title: "Recruiter",
    subtitle: "View",
    icon: "briefcase",
    color: "linear-gradient(135deg, #FFB6C1, #FF69B4)",
    textColor: "#8B1A4A",
    row: 0,
    col: 0,
  },
  {
    id: "engineer",
    title: "Engineer",
    subtitle: "View",
    icon: "code",
    color: "linear-gradient(135deg, #87CEEB, #4A90D9)",
    textColor: "#1A3A5C",
    row: 0,
    col: 1,
  },
  {
    id: "creative",
    title: "Creative",
    subtitle: "Lab",
    icon: "palette",
    color: "linear-gradient(135deg, #98FB98, #32CD32)",
    textColor: "#1A4A1A",
    row: 0,
    col: 2,
  },
  {
    id: "all-projects",
    title: "All",
    subtitle: "Projects",
    icon: "grid",
    color: "linear-gradient(135deg, #DDA0DD, #9370DB)",
    textColor: "#3A1A5C",
    row: 0,
    col: 3,
  },
  // Row 2 - Project Categories
  {
    id: "web-apps",
    title: "Web Apps",
    subtitle: "Channel",
    icon: "globe",
    color: "linear-gradient(135deg, #4A90D9, #2E5CA8)",
    textColor: "#FFFFFF",
    row: 1,
    col: 0,
  },
  {
    id: "open-source",
    title: "Open Source",
    subtitle: "Channel",
    icon: "github",
    color: "linear-gradient(135deg, #3CB371, #228B22)",
    textColor: "#FFFFFF",
    row: 1,
    col: 1,
  },
  {
    id: "creative-lab",
    title: "Creative",
    subtitle: "Lab",
    icon: "sparkles",
    color: "linear-gradient(135deg, #FF8C00, #FF4500)",
    textColor: "#FFFFFF",
    row: 1,
    col: 2,
  },
  {
    id: "archive",
    title: "Archive",
    subtitle: "Channel",
    icon: "archive",
    color: "linear-gradient(135deg, #D2B48C, #A0522D)",
    textColor: "#FFFFFF",
    row: 1,
    col: 3,
  },
  // Row 3 - Info & Tools
  {
    id: "tech-stack",
    title: "Tech Stack",
    subtitle: "Channel",
    icon: "cpu",
    color: "linear-gradient(135deg, #87CEEB, #5BA3CF)",
    textColor: "#1A3A5C",
    row: 2,
    col: 0,
  },
  {
    id: "about-me",
    title: "About Me",
    subtitle: "Channel",
    icon: "user",
    color: "linear-gradient(135deg, #B8D4E8, #8BB8D6)",
    textColor: "#1A3A5C",
    row: 2,
    col: 1,
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "",
    icon: "mail",
    color: "linear-gradient(135deg, #F5F5F5, #E0E0E0)",
    textColor: "#333333",
    row: 2,
    col: 2,
  },
  {
    id: "settings",
    title: "Settings",
    subtitle: "",
    icon: "settings",
    color: "linear-gradient(135deg, #2C3E50, #1A252F)",
    textColor: "#FFFFFF",
    row: 2,
    col: 3,
  },
]

export type Project = {
  id: string
  title: string
  tagline: string
  description: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  category: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    tagline: "Full-stack shopping experience",
    description: "A complete e-commerce solution with product management, cart functionality, payment processing, and order tracking. Built with performance and UX in mind.",
    techStack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    category: ["web-apps", "recruiter"],
    featured: true,
  },
  {
    id: "ai-chat-app",
    title: "AI Chat Assistant",
    tagline: "Conversational AI interface",
    description: "An intelligent chat application powered by large language models with streaming responses, conversation history, and context-aware suggestions.",
    techStack: ["React", "AI SDK", "Node.js", "Redis", "WebSocket"],
    liveUrl: "#",
    githubUrl: "#",
    category: ["web-apps", "engineer", "creative-lab"],
    featured: true,
  },
  {
    id: "design-system",
    title: "Component Library",
    tagline: "Open-source UI kit",
    description: "A comprehensive design system with 50+ accessible components, theming support, and full documentation. Used by 500+ developers.",
    techStack: ["React", "TypeScript", "Storybook", "Radix UI", "CSS Modules"],
    liveUrl: "#",
    githubUrl: "#",
    category: ["open-source", "engineer"],
    featured: true,
  },
  {
    id: "real-time-collab",
    title: "Real-Time Collab",
    tagline: "Multiplayer canvas editor",
    description: "A collaborative whiteboard application with real-time cursor tracking, shape tools, and infinite canvas. Supports up to 50 concurrent users.",
    techStack: ["Next.js", "WebSocket", "Canvas API", "CRDT", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    category: ["web-apps", "creative-lab", "engineer"],
  },
  {
    id: "cli-tool",
    title: "Dev CLI Tool",
    tagline: "Productivity booster",
    description: "A command-line tool that scaffolds projects, manages configurations, and automates repetitive development tasks with an interactive interface.",
    techStack: ["Node.js", "TypeScript", "Ink", "Commander.js"],
    githubUrl: "#",
    category: ["open-source", "engineer"],
  },
  {
    id: "music-visualizer",
    title: "Music Visualizer",
    tagline: "Audio-reactive 3D art",
    description: "An interactive music visualizer that creates stunning 3D visuals responding to audio input in real-time using WebGL and the Web Audio API.",
    techStack: ["Three.js", "Web Audio API", "GLSL", "React"],
    liveUrl: "#",
    githubUrl: "#",
    category: ["creative-lab", "creative"],
  },
  {
    id: "portfolio-v1",
    title: "Portfolio v1",
    tagline: "The original portfolio",
    description: "My first developer portfolio built while learning React. A clean single-page application with project showcases and a contact form.",
    techStack: ["React", "CSS", "Firebase"],
    githubUrl: "#",
    category: ["archive"],
  },
  {
    id: "weather-app",
    title: "Weather Dashboard",
    tagline: "Learn and explore",
    description: "A weather dashboard built as a learning project, featuring geolocation, 7-day forecasts, and animated weather conditions.",
    techStack: ["Vue.js", "OpenWeather API", "Chart.js"],
    githubUrl: "#",
    category: ["archive"],
  },
]

export type Skill = {
  name: string
  level: number
  icon: string
  category: string
}

export const skills: Skill[] = [
  { name: "TypeScript", level: 95, icon: "TS", category: "Languages" },
  { name: "JavaScript", level: 95, icon: "JS", category: "Languages" },
  { name: "Python", level: 75, icon: "PY", category: "Languages" },
  { name: "Rust", level: 45, icon: "RS", category: "Languages" },
  { name: "React", level: 95, icon: "Re", category: "Frameworks" },
  { name: "Next.js", level: 92, icon: "Nx", category: "Frameworks" },
  { name: "Node.js", level: 88, icon: "No", category: "Frameworks" },
  { name: "Tailwind CSS", level: 90, icon: "TW", category: "Frameworks" },
  { name: "PostgreSQL", level: 82, icon: "PG", category: "Tools" },
  { name: "Redis", level: 70, icon: "RD", category: "Tools" },
  { name: "Docker", level: 75, icon: "DK", category: "Tools" },
  { name: "Git", level: 92, icon: "GT", category: "Tools" },
  { name: "AWS", level: 70, icon: "AW", category: "Cloud" },
  { name: "Vercel", level: 90, icon: "VC", category: "Cloud" },
  { name: "Firebase", level: 72, icon: "FB", category: "Cloud" },
]
