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
