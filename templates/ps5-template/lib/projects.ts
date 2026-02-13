// types for the project data

export type UserProfile = "recruiter" | "engineer" | "stranger"

export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  fullDescription: string
  techStack: string[]
  achievements: number
  totalAchievements: number
  progress: number
  coverImage: string
  backgroundImage: string
  liveUrl?: string
  githubUrl?: string
  demoVideo?: string
  screenshots?: string[]
  priority: {
    recruiter: number
    engineer: number
    stranger: number
  }
}
