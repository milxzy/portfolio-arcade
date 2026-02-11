"use client"

import { skills } from "@/lib/channels"
import { useMemo } from "react"

export function TechStackView() {
  const categories = useMemo(() => {
    const cats: Record<string, typeof skills> = {}
    for (const skill of skills) {
      if (!cats[skill.category]) cats[skill.category] = []
      cats[skill.category].push(skill)
    }
    return cats
  }, [])

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([category, categorySkills], catIdx) => (
        <div key={category} className="wii-slide-up" style={{ animationDelay: `${catIdx * 100}ms` }}>
          <h3 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-3">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categorySkills.map((skill, i) => (
              <div
                key={skill.name}
                className="flex items-center gap-3 rounded-xl bg-white/60 p-3"
                style={{ animationDelay: `${(catIdx * 100) + (i * 50)}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#3B9BD9]/15 flex items-center justify-center text-xs font-bold text-[#3B9BD9] shrink-0">
                  {skill.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-[#2A3A4A]">
                      {skill.name}
                    </span>
                    <span className="text-xs font-semibold text-[#7A8A9A]">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E0E8F0] overflow-hidden">
                    <div
                      className="h-full rounded-full progress-bar-fill"
                      style={{
                        width: `${skill.level}%`,
                        background: skill.level > 85
                          ? "linear-gradient(90deg, #3B9BD9, #2ECC71)"
                          : skill.level > 65
                          ? "linear-gradient(90deg, #3B9BD9, #87CEEB)"
                          : "linear-gradient(90deg, #87CEEB, #B8D4E8)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
