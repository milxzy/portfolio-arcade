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
