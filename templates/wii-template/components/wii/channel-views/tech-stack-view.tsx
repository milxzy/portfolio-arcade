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
    <div className="space-y-4 sm:space-y-6">
      {Object.entries(categories).map(([category, categorySkills], catIdx) => (
        <div key={category} className="wii-slide-up" style={{ animationDelay: `${catIdx * 100}ms` }}>
          <h3 className="text-xs sm:text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-2 sm:mb-3">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categorySkills.map((skill, i) => (
              <div
                key={skill.name}
                className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-white/60 px-3 py-2 sm:px-4 sm:py-2.5"
                style={{ animationDelay: `${(catIdx * 100) + (i * 50)}ms` }}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md bg-[#3B9BD9]/15 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-[#3B9BD9] shrink-0">
                  {skill.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#2A3A4A]">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
