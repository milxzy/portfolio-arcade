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

// all the projects, each with a priority per profile type
export const projects: Project[] = [
  {
    id: "dotfile-picker",
    title: "Dotfile Picker",
    subtitle: "Configuration Management Tool",
    description: "a tool for managing and selecting dotfiles configurations",
    fullDescription: "created a comprehensive dotfile management system that allows users to easily pick, configure, and deploy dotfiles across different environments. streamlines development environment setup.",
    techStack: ["Shell", "Bash", "Git"],
    achievements: 8,
    totalAchievements: 10,
    progress: 80,
    coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1920&h=1080&fit=crop",
    githubUrl: "https://github.com/milxzy/dotfile-picker",
    priority: { recruiter: 4, engineer: 2, stranger: 5 },
  },
  {
    id: "fullbonkers-website",
    title: "Full Bonkers",
    subtitle: "Creative Website",
    description: "a creative website showcasing unique digital experiences",
    fullDescription: "designed and developed fullbonkers.com, a creative digital platform featuring interactive elements and engaging user experiences. focuses on creative expression and digital artistry.",
    techStack: ["HTML", "CSS", "JavaScript", "Creative Coding"],
    achievements: 12,
    totalAchievements: 15,
    progress: 90,
    coverImage: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=1080&fit=crop",
    liveUrl: "https://fullbonkers.com",
    priority: { recruiter: 3, engineer: 4, stranger: 1 },
  },
  {
    id: "melody-match",
    title: "MelodyMatch",
    subtitle: "Music Discovery Platform",
    description: "a music matching and discovery application",
    fullDescription: "built a music discovery platform that helps users find new songs and artists based on their preferences. features advanced matching algorithms and personalized recommendations.",
    techStack: ["React", "Node.js", "Music APIs", "Machine Learning"],
    achievements: 10,
    totalAchievements: 12,
    progress: 85,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop",
    githubUrl: "https://github.com/milxzy/MelodyMatch",
    priority: { recruiter: 2, engineer: 3, stranger: 2 },
  },
  {
    id: "417-mowing",
    title: "417 Mowing",
    subtitle: "Lawn Care Business Platform",
    description: "a business management platform for lawn care services",
    fullDescription: "developed a comprehensive business management system for 417 Mowing, featuring customer management, scheduling, invoicing, and service tracking. streamlines operations for lawn care businesses.",
    techStack: ["React", "Node.js", "PostgreSQL", "Business Logic"],
    achievements: 15,
    totalAchievements: 15,
    progress: 100,
    coverImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop",
    githubUrl: "https://github.com/milxzy/417Mowing",
    priority: { recruiter: 1, engineer: 5, stranger: 4 },
  },
  {
    id: "wp-plugin-1",
    title: "WordPress Plugin #1",
    subtitle: "Custom WordPress Solution",
    description: "a custom wordpress plugin for enhanced functionality",
    fullDescription: "developed a specialized wordpress plugin that extends core functionality with custom features. designed for scalability and ease of use across different wordpress installations.",
    techStack: ["PHP", "WordPress", "MySQL", "JavaScript"],
    achievements: 6,
    totalAchievements: 8,
    progress: 75,
    coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1920&h=1080&fit=crop",
    priority: { recruiter: 8, engineer: 8, stranger: 8 },
  },
  {
    id: "wp-plugin-2",
    title: "WordPress Plugin #2",
    subtitle: "Advanced WordPress Extension",
    description: "another custom wordpress plugin with specialized features",
    fullDescription: "created an advanced wordpress plugin that provides specialized functionality for content management and user interaction. focuses on performance and user experience optimization.",
    techStack: ["PHP", "WordPress", "MySQL", "AJAX"],
    achievements: 5,
    totalAchievements: 8,
    progress: 65,
    coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1920&h=1080&fit=crop",
    priority: { recruiter: 9, engineer: 9, stranger: 9 },
  },
  {
    id: "wp-plugin-3",
    title: "WordPress Plugin #3",
    subtitle: "WordPress Integration Tool",
    description: "a wordpress plugin for seamless third-party integrations",
    fullDescription: "built a wordpress plugin that facilitates seamless integration with third-party services and APIs. enhances website functionality while maintaining wordpress best practices.",
    techStack: ["PHP", "WordPress", "REST APIs", "OAuth"],
    achievements: 4,
    totalAchievements: 8,
    progress: 50,
    coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1920&h=1080&fit=crop",
    priority: { recruiter: 10, engineer: 10, stranger: 10 },
  },
  {
    id: "wp-plugin-4",
    title: "WordPress Plugin #4",
    subtitle: "WordPress Performance Tool",
    description: "a wordpress plugin focused on performance optimization",
    fullDescription: "developed a performance-focused wordpress plugin that optimizes website speed, caching, and resource management. implements advanced caching strategies and performance monitoring.",
    techStack: ["PHP", "WordPress", "Caching", "Performance"],
    achievements: 7,
    totalAchievements: 8,
    progress: 85,
    coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1920&h=1080&fit=crop",
    priority: { recruiter: 11, engineer: 11, stranger: 11 },
  },
  {
    id: "bottlecap-site",
    title: "Bottlecap Site",
    subtitle: "Creative Website Project",
    description: "a creative website for bottlecap-related content and community",
    fullDescription: "designed and developed the bottlecap site, featuring creative design elements and community features. focuses on user engagement and creative content presentation.",
    techStack: ["React", "CSS", "JavaScript", "Creative Design"],
    achievements: 9,
    totalAchievements: 12,
    progress: 75,
    coverImage: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=1080&fit=crop",
    githubUrl: "https://github.com/milxzy/bottlecap-site",
    priority: { recruiter: 6, engineer: 7, stranger: 6 },
  },
  {
    id: "fit-one-site",
    title: "Fit One Site",
    subtitle: "Fitness Platform",
    description: "a fitness and wellness platform website",
    fullDescription: "created a comprehensive fitness platform website featuring workout tracking, health metrics, and community features. designed with user experience and motivation in mind.",
    techStack: ["React", "Node.js", "Fitness APIs", "Health Tracking"],
    achievements: 11,
    totalAchievements: 14,
    progress: 80,
    coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop",
    githubUrl: "https://github.com/milxzy/fit-one-site",
    priority: { recruiter: 7, engineer: 6, stranger: 7 },
  },
  {
    id: "alignbylala-site",
    title: "AlignByLala Site",
    subtitle: "Wellness & Alignment Platform",
    description: "a wellness platform focusing on personal alignment and growth",
    fullDescription: "developed alignbylala site, a wellness platform that helps users achieve personal alignment through guided practices, resources, and community support. emphasizes holistic wellness approaches.",
    techStack: ["React", "Wellness APIs", "Content Management", "User Experience"],
    achievements: 8,
    totalAchievements: 10,
    progress: 80,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    githubUrl: "https://github.com/milxzy/alignbylala-site",
    priority: { recruiter: 5, engineer: 12, stranger: 3 },
  },
  {
    id: "portfolio-template",
    title: "Portfolio Template",
    subtitle: "Reusable Portfolio Framework",
    description: "a customizable portfolio template for developers and creatives",
    fullDescription: "creating a comprehensive portfolio template that developers and creatives can use to showcase their work. features modular components, theme customization, and responsive design patterns.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Template Design"],
    achievements: 0,
    totalAchievements: 12,
    progress: 0,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
    priority: { recruiter: 12, engineer: 1, stranger: 12 },
  },
  {
    id: "personal-portfolio",
    title: "Personal Portfolio Code",
    subtitle: "This Portfolio Website",
    description: "the source code for this ps5-styled portfolio website",
    fullDescription: "the complete source code for this interactive ps5-styled portfolio website. features modern react components, creative animations, and a unique gaming-inspired user interface. demonstrates advanced frontend development skills.",
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    achievements: 14,
    totalAchievements: 15,
    progress: 95,
    coverImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop",
    backgroundImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1920&h=1080&fit=crop",
    priority: { recruiter: 13, engineer: 13, stranger: 13 },
  },
]

// sorts projects by priority for the given profile
export function getProjectsForProfile(profile: UserProfile): Project[] {
  return [...projects].sort((a, b) => a.priority[profile] - b.priority[profile])
}
