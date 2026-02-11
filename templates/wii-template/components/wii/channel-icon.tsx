"use client"

import React from "react"

import {
  Briefcase,
  Code,
  Palette,
  Grid3X3,
  Globe,
  Github,
  Sparkles,
  Archive,
  Cpu,
  User,
  Mail,
  Settings,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  briefcase: Briefcase,
  code: Code,
  palette: Palette,
  grid: Grid3X3,
  globe: Globe,
  github: Github,
  sparkles: Sparkles,
  archive: Archive,
  cpu: Cpu,
  user: User,
  mail: Mail,
  settings: Settings,
}

export function ChannelIcon({
  icon,
  size = 32,
  className,
}: {
  icon: string
  size?: number
  className?: string
}) {
  const Icon = iconMap[icon]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
