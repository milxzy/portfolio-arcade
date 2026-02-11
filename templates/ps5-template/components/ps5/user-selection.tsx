"use client"

import { useState, useEffect } from "react"
import { Gamepad2, Power, User, Code, Globe } from "lucide-react"
import type { UserProfile } from "@/lib/projects"

interface Props {
  onSelectProfile: (profile: UserProfile) => void
}

// little floating dot
interface Particle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  color: string
}

const profiles: { id: UserProfile; name: string; icon: typeof User; color: string }[] = [
  { id: "recruiter", name: "Recruiter", icon: User, color: "from-blue-500 to-blue-700" },
  { id: "engineer", name: "Engineer", icon: Code, color: "from-emerald-500 to-emerald-700" },
  { id: "stranger", name: "Internet Stranger", icon: Globe, color: "from-amber-500 to-amber-700" },
]

// the "who's playing?" screen
export function UserSelection({ onSelectProfile }: Props) {
  const [idx, setIdx] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  // spawn some floaty particles on mount
  useEffect(() => {
    const dots: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      color: Math.random() > 0.7 ? "bg-amber-400/60" : "bg-white/20",
    }))
    setParticles(dots)
  }, [])

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (animating) return

      if (e.key === "ArrowLeft") {
        setIdx((prev) => (prev > 0 ? prev - 1 : profiles.length - 1))
      } else if (e.key === "ArrowRight") {
        setIdx((prev) => (prev < profiles.length - 1 ? prev + 1 : 0))
      } else if (e.key === "Enter" || e.key === " ") {
        pick(profiles[idx].id)
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [idx, animating])

  const pick = (profile: UserProfile) => {
    setAnimating(true)
    // fade out then navigate
    setTimeout(() => {
      onSelectProfile(profile)
    }, 500)
  }

  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0a0f14] via-[#141b24] to-[#0a0f14] overflow-hidden">
      {/* floaty bits */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`absolute rounded-full animate-float ${p.color}`}
            style={{
              left: `${p.left}%`,
              bottom: "-20px",
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* light beam thing */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-b from-white/5 to-transparent blur-3xl transform -translate-x-1/2" />

      {/* clock */}
      <div className="absolute top-6 right-8 text-white/80 text-xl font-light tracking-wide">
        {time}
      </div>

      {/* main stuff */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4 tracking-tight">
            Welcome Back to <span className="font-medium">MilxOS</span>
          </h1>
          <p className="text-white/60 text-xl font-light">{"Who's playing?"}</p>
        </div>

        {/* controller icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          <Gamepad2 className="relative w-8 h-8 text-white/60" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-medium">
            1
          </span>
        </div>

        {/* profile picker */}
        <div className="flex items-center gap-8 md:gap-12">
          {profiles.map((profile, i) => {
            const Icon = profile.icon
            const selected = i === idx

            return (
              <button
                type="button"
                key={profile.id}
                onClick={() => {
                  setIdx(i)
                  pick(profile.id)
                }}
                className={`group relative flex flex-col items-center transition-all duration-300 ${
                  selected ? "scale-110" : "scale-100 opacity-70 hover:opacity-100"
                }`}
              >
                {/* ring around selected */}
                {selected && (
                  <div className="absolute -inset-4 rounded-full border-2 border-white/30 animate-pulse-ring" />
                )}

                {/* avatar circle */}
                <div
                  className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center transition-all duration-300 ${
                    selected ? "ring-4 ring-white/50 animate-glow" : ""
                  }`}
                >
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>

                {/* name */}
                <span
                  className={`mt-4 text-sm md:text-base font-medium transition-colors duration-300 ${
                    selected ? "text-white" : "text-white/60"
                  }`}
                >
                  {profile.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* hint text */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/40 text-sm">
          <span className="hidden md:inline">Use arrow keys to navigate</span>
          <span className="hidden md:inline">•</span>
          <span>Press Enter or click to select</span>
        </div>

        {/* power btn */}
        <button
          type="button"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 p-3 rounded-full border border-white/20 text-white/40 hover:text-white/60 hover:border-white/40 transition-all duration-300"
          aria-label="Power"
        >
          <Power className="w-6 h-6" />
        </button>

        {/* select hint */}
        <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 text-white/40 text-sm">
          <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-xs">
            X
          </div>
          <span>Select</span>
        </div>
      </div>

      {/* fade to black overlay */}
      <div
        className={`absolute inset-0 bg-black z-50 transition-opacity duration-500 pointer-events-none ${
          animating ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
