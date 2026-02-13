// Loads portfolio data from data/portfolio.json with fallback to defaults
import { readFileSync } from "fs"
import { join } from "path"
import type { XMBCategory, XMBItem, UserProfile } from "./xmb-data"

export interface PortfolioData {
  user: {
    name: string
    title: string
    bio: string
    avatar: string
    social: {
      github?: string
      linkedin?: string
      email?: string
      website?: string
      twitter?: string
    }
  }
  projects: XMBItem[]
  theme: string
}

// Loads portfolio data from JSON file and transforms it into XMB categories
export function loadPortfolioCategories(): XMBCategory[] {
  try {
    const dataPath = join(process.cwd(), "data", "portfolio.json")
    const rawData = readFileSync(dataPath, "utf-8")
    const data = JSON.parse(rawData) as PortfolioData
    
    return buildXMBCategories(data)
  } catch (error) {
    console.warn("Could not load data/portfolio.json, using defaults:", error)
    return getDefaultCategories()
  }
}

// Transforms portfolio data into PS3 XMB category structure
function buildXMBCategories(data: PortfolioData): XMBCategory[] {
  return [
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
      items: data.projects || [],
    },
    {
      id: "tech",
      label: "Tech Stack",
      icon: "cpu",
      items: [
        {
          id: "tech-summary",
          label: "Technologies",
          subtitle: extractTechSummary(data.projects),
          description: `Tech stack used across ${data.projects?.length || 0} projects`,
          tags: extractUniqueTech(data.projects),
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
          subtitle: data.user.title || "Developer",
          description: data.user.bio || "A passionate developer creating amazing experiences",
        },
        {
          id: "about-contact",
          label: "Contact",
          subtitle: "Get in touch",
          description: buildContactDescription(data.user.social),
          links: buildContactLinks(data.user.social),
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
}

// Extracts unique technologies from projects
function extractUniqueTech(projects: XMBItem[]): string[] {
  const techSet = new Set<string>()
  projects?.forEach((project) => {
    project.tags?.forEach((tech) => techSet.add(tech))
  })
  return Array.from(techSet).slice(0, 10) // Top 10 technologies
}

// Creates a summary of tech stack
function extractTechSummary(projects: XMBItem[]): string {
  const tech = extractUniqueTech(projects)
  return tech.slice(0, 5).join(", ")
}

// Builds contact description from social links
function buildContactDescription(social: PortfolioData["user"]["social"]): string {
  const parts = []
  if (social.email) parts.push(`Email: ${social.email}`)
  if (social.github) parts.push(`GitHub: ${social.github}`)
  if (social.linkedin) parts.push(`LinkedIn: ${social.linkedin}`)
  return parts.join("\n") || "Get in touch to collaborate!"
}

// Builds contact links array
function buildContactLinks(social: PortfolioData["user"]["social"]): { label: string; url: string }[] {
  const links = []
  if (social.email) links.push({ label: "Email", url: `mailto:${social.email}` })
  if (social.github) links.push({ label: "GitHub", url: social.github })
  if (social.linkedin) links.push({ label: "LinkedIn", url: social.linkedin })
  if (social.twitter) links.push({ label: "Twitter", url: social.twitter })
  if (social.website) links.push({ label: "Website", url: social.website })
  return links
}

// Returns default categories if JSON doesn't exist
function getDefaultCategories(): XMBCategory[] {
  return [
    {
      id: "users",
      label: "Users",
      icon: "users",
      items: [
        {
          id: "recruiter",
          label: "Recruiter",
          subtitle: "Hiring Manager / Talent Scout",
          description: "View production-ready applications and commercial projects.",
          icon: "briefcase",
        },
        {
          id: "engineer",
          label: "Engineer",
          subtitle: "Fellow Developer / Tech Lead",
          description: "Explore technical implementations and system design.",
          icon: "code",
        },
        {
          id: "stranger",
          label: "Internet Stranger",
          subtitle: "Curious Visitor",
          description: "Check out creative experiments and fun projects.",
          icon: "globe",
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      icon: "gamepad",
      items: [],
    },
    {
      id: "about",
      label: "About",
      icon: "user",
      items: [
        {
          id: "about-bio",
          label: "Bio",
          subtitle: "Developer",
          description: "Edit data/portfolio.json to add your information here.",
        },
      ],
    },
  ]
}

// Filters projects by profile priority
export function getProjectsForProfile(categories: XMBCategory[], profile: UserProfile): XMBItem[] {
  const projectsCat = categories.find((c) => c.id === "projects")
  if (!projectsCat) return []
  
  return [...projectsCat.items]
    .filter((item) => {
      const priority = item.profilePriority as UserProfile[] | undefined
      return !priority || priority.includes(profile)
    })
    .sort((a, b) => {
      const aIdx = (a.profilePriority as UserProfile[] | undefined)?.indexOf(profile) ?? -1
      const bIdx = (b.profilePriority as UserProfile[] | undefined)?.indexOf(profile) ?? -1
      const aScore = aIdx >= 0 ? aIdx : 999
      const bScore = bIdx >= 0 ? bIdx : 999
      return aScore - bScore
    })
}
