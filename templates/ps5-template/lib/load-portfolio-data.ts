// Loads portfolio data from data/portfolio.json with fallback to defaults
import { readFileSync } from "fs"
import { join } from "path"
import type { UserProfile, Project } from "./projects"

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
  projects: Project[]
  theme: string
}

// Loads portfolio data from JSON file
export function loadPortfolioData(): PortfolioData {
  try {
    const dataPath = join(process.cwd(), "data", "portfolio.json")
    const rawData = readFileSync(dataPath, "utf-8")
    const data = JSON.parse(rawData) as PortfolioData
    return data
  } catch (error) {
    console.warn("Could not load data/portfolio.json, using defaults:", error)
    return getDefaultData()
  }
}

// Returns default/placeholder data if JSON file doesn't exist
function getDefaultData(): PortfolioData {
  return {
    user: {
      name: "Your Name",
      title: "Software Developer",
      bio: "A passionate developer creating amazing digital experiences",
      avatar: "/images/avatar.jpg",
      social: {
        github: "https://github.com/username",
        linkedin: "https://linkedin.com/in/username",
        email: "hello@example.com",
      },
    },
    projects: [],
    theme: "ps5",
  }
}

// Sorts projects by priority for the given profile
export function getProjectsForProfile(
  projects: Project[],
  profile: UserProfile
): Project[] {
  return [...projects].sort((a, b) => a.priority[profile] - b.priority[profile])
}
