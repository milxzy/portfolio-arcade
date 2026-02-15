/**
 * Channel - A clickable tile on the Wii menu grid
 * 
 * @property id - Unique identifier used for routing and filtering
 * @property title - Main text displayed on the channel
 * @property subtitle - Secondary text below the title (optional)
 * @property icon - Icon name from lucide-react (e.g., "briefcase", "code", "globe")
 * @property color - CSS gradient for the channel background
 * @property textColor - Text color (use contrast with background)
 * @property row - Grid row position (0-indexed)
 * @property col - Grid column position (0-indexed, max 3)
 */
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

/**
 * Project - A portfolio project (loaded from /public/data/portfolio.json)
 * 
 * NOTE: Projects are defined in /public/data/portfolio.json, not here.
 *       See portfolio.schema.json for full documentation.
 * 
 * @property id - Unique identifier (lowercase with hyphens)
 * @property title - Project name
 * @property tagline - Short catchy description (1 line)
 * @property description - Longer description (2-4 sentences)
 * @property techStack - Array of technology names (e.g., ["React", "TypeScript"])
 * @property liveUrl - URL to deployed project (optional)
 * @property githubUrl - URL to GitHub repo (optional)
 * @property category - Array of channel IDs: "web-apps", "open-source", "creative-lab", "archive"
 * @property featured - If true, shows in recruiter/featured view (optional)
 */
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

/**
 * Skill - A technology/skill displayed in the Tech Stack channel
 * 
 * @property name - Display name of the technology (e.g., "TypeScript")
 * @property icon - 2-letter abbreviation shown in the icon badge (e.g., "TS")
 * @property category - Group this skill belongs to: "Languages", "Frameworks", "Tools", or "Cloud"
 */
export type Skill = {
  name: string
  icon: string
  category: string
}

/**
 * Skills array - Add your technologies here
 * 
 * Categories:
 *   - "Languages"  - Programming languages (TypeScript, Python, etc.)
 *   - "Frameworks" - Libraries and frameworks (React, Next.js, etc.)
 *   - "Tools"      - Development tools and databases (Docker, PostgreSQL, etc.)
 *   - "Cloud"      - Cloud platforms and services (AWS, Vercel, etc.)
 * 
 * Example:
 *   { name: "TypeScript", icon: "TS", category: "Languages" }
 */
export const skills: Skill[] = [
  // Languages - Programming languages you use
  { name: "TypeScript", icon: "TS", category: "Languages" },
  { name: "JavaScript", icon: "JS", category: "Languages" },
  { name: "Python", icon: "PY", category: "Languages" },
  { name: "Rust", icon: "RS", category: "Languages" },
  
  // Frameworks - Libraries and frameworks
  { name: "React", icon: "Re", category: "Frameworks" },
  { name: "Next.js", icon: "Nx", category: "Frameworks" },
  { name: "Node.js", icon: "No", category: "Frameworks" },
  { name: "Tailwind CSS", icon: "TW", category: "Frameworks" },
  
  // Tools - Development tools and databases
  { name: "PostgreSQL", icon: "PG", category: "Tools" },
  { name: "Redis", icon: "RD", category: "Tools" },
  { name: "Docker", icon: "DK", category: "Tools" },
  { name: "Git", icon: "GT", category: "Tools" },
  
  // Cloud - Cloud platforms and services
  { name: "AWS", icon: "AW", category: "Cloud" },
  { name: "Vercel", icon: "VC", category: "Cloud" },
  { name: "Firebase", icon: "FB", category: "Cloud" },
]
