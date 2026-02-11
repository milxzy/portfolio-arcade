import React from "react"
import {
  Briefcase,
  Code,
  Cpu,
  Gamepad2,
  Globe,
  Settings,
  User,
  Users,
  Monitor,
  Download,
  Mail,
  FileText,
  Volume2,
  Layers,
  Zap,
  Wrench,
} from "lucide-react"
import type { LucideProps } from "lucide-react"

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  users: Users,
  user: User,
  gamepad: Gamepad2,
  cpu: Cpu,
  settings: Settings,
  briefcase: Briefcase,
  code: Code,
  globe: Globe,
  monitor: Monitor,
  download: Download,
  mail: Mail,
  file: FileText,
  volume: Volume2,
  layers: Layers,
  zap: Zap,
  wrench: Wrench,
}

interface XMBIconProps extends LucideProps {
  name: string
}

export function XMBIcon({ name, ...props }: XMBIconProps) {
  const Icon = iconMap[name] || Globe
  return <Icon {...props} />
}
