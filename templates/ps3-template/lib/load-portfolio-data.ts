// Loads portfolio data from data/portfolio.json with fallback to defaults
// This file should only be imported in Server Components or API routes
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
export async function loadPortfolioCategories(): Promise<XMBCategory[]> {
  try {
    // In Next.js, fetch from public directory or API route
    const response = await fetch('/data/portfolio.json', { cache: 'no-store' })
    if (!response.ok) throw new Error('Failed to load portfolio.json')
    const data = await response.json() as PortfolioData
    
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
      items: buildTechStackItems(data.projects),
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
  return Array.from(techSet)
}

// Categorizes technologies into frontend/backend/devops/other
function categorizeTech(tech: string): string {
  const techLower = tech.toLowerCase()
  
  // Frontend technologies
  const frontend = [
    'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby',
    'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap', 'material-ui',
    'javascript', 'typescript', 'jsx', 'tsx', 'webpack', 'vite', 'rollup',
    'redux', 'mobx', 'zustand', 'recoil', 'jquery', 'emotion', 'styled-components'
  ]
  
  // Backend technologies
  const backend = [
    'node.js', 'express', 'fastify', 'nest.js', 'koa', 'hapi',
    'python', 'django', 'flask', 'fastapi', 'ruby', 'rails', 'sinatra',
    'php', 'laravel', 'symfony', 'java', 'spring', 'kotlin', 'go', 'gin',
    'rust', 'actix', 'axum', 'c#', '.net', 'asp.net',
    'graphql', 'rest', 'api', 'postgresql', 'mysql', 'mongodb', 'redis',
    'sqlite', 'prisma', 'typeorm', 'sequelize', 'mongoose'
  ]
  
  // DevOps & Tools
  const devops = [
    'docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'heroku', 'vercel',
    'netlify', 'digitalocean', 'terraform', 'ansible', 'jenkins', 'github actions',
    'gitlab ci', 'circleci', 'travis', 'nginx', 'apache', 'cloudflare',
    'git', 'github', 'gitlab', 'bitbucket', 'linux', 'bash', 'shell'
  ]
  
  if (frontend.some(f => techLower.includes(f))) return 'frontend'
  if (backend.some(b => techLower.includes(b))) return 'backend'
  if (devops.some(d => techLower.includes(d))) return 'devops'
  return 'other'
}

// Builds categorized tech stack items
function buildTechStackItems(projects: XMBItem[]): XMBItem[] {
  const allTech = extractUniqueTech(projects)
  
  // Group tech by category
  const categorized: Record<string, string[]> = {
    frontend: [],
    backend: [],
    devops: [],
    other: [],
  }
  
  allTech.forEach(tech => {
    const category = categorizeTech(tech)
    categorized[category].push(tech)
  })
  
  // Build items only for non-empty categories
  const items: XMBItem[] = []
  
  if (categorized.frontend.length > 0) {
    const hasMore = categorized.frontend.length > 3
    items.push({
      id: "tech-frontend",
      label: "Frontend",
      subtitle: categorized.frontend.slice(0, 3).join(", ") + (hasMore ? " ..." : ""),
      description: `Frontend technologies and frameworks used across projects: ${categorized.frontend.join(", ")}`,
      tags: categorized.frontend,
    })
  }
  
  if (categorized.backend.length > 0) {
    const hasMore = categorized.backend.length > 3
    items.push({
      id: "tech-backend",
      label: "Backend",
      subtitle: categorized.backend.slice(0, 3).join(", ") + (hasMore ? " ..." : ""),
      description: `Backend technologies, databases, and APIs used across projects: ${categorized.backend.join(", ")}`,
      tags: categorized.backend,
    })
  }
  
  if (categorized.devops.length > 0) {
    const hasMore = categorized.devops.length > 3
    items.push({
      id: "tech-devops",
      label: "DevOps & Tools",
      subtitle: categorized.devops.slice(0, 3).join(", ") + (hasMore ? " ..." : ""),
      description: `DevOps, cloud platforms, and development tools used: ${categorized.devops.join(", ")}`,
      tags: categorized.devops,
    })
  }
  
  if (categorized.other.length > 0) {
    const hasMore = categorized.other.length > 3
    items.push({
      id: "tech-other",
      label: "Other Technologies",
      subtitle: categorized.other.slice(0, 3).join(", ") + (hasMore ? " ..." : ""),
      description: `Other technologies and tools: ${categorized.other.join(", ")}`,
      tags: categorized.other,
    })
  }
  
  // If no items, return a default message
  if (items.length === 0) {
    items.push({
      id: "tech-none",
      label: "No Technologies",
      subtitle: "Add projects to see your tech stack",
      description: "Technologies will appear here once you add projects with tech stacks.",
      tags: [],
    })
  }
  
  return items
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
