"use client"

import { MapPin, Calendar, Heart, Zap } from "lucide-react"

export function AboutView() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Profile header */}
      <div className="wii-slide-up flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
        {/* Mii-style avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/80 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
          <svg width="50" height="50" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[60px] sm:h-[60px]">
            {/* Simple Mii-style face */}
            <circle cx="30" cy="26" r="18" fill="#FFD4A3" />
            <ellipse cx="23" cy="24" rx="2.5" ry="3" fill="#2A3A4A" />
            <ellipse cx="37" cy="24" rx="2.5" ry="3" fill="#2A3A4A" />
            <path d="M25 32 Q30 36 35 32" stroke="#2A3A4A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M16 18 Q20 8 30 6 Q40 8 44 18" fill="#4A3728" />
            <ellipse cx="30" cy="52" rx="14" ry="8" fill="#3B9BD9" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#2A3A4A]">Developer Mii</h3>
          <p className="text-xs sm:text-sm text-[#5A6A7A] mt-0.5">
            Full-Stack Developer & Creative Technologist
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[#7A8A9A]">
              <MapPin size={10} className="sm:w-3 sm:h-3" /> San Francisco, CA
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-[#7A8A9A]">
              <Calendar size={10} className="sm:w-3 sm:h-3" /> 5+ years
            </span>
          </div>
        </div>
      </div>

      {/* Bio sections */}
      <div className="wii-slide-up grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4" style={{ animationDelay: "100ms" }}>
        <div className="rounded-xl sm:rounded-2xl bg-white/60 p-3 sm:p-5">
          <h4 className="text-xs sm:text-sm font-bold text-[#3B9BD9] uppercase tracking-wide flex items-center gap-1.5 mb-2 sm:mb-3">
            <Zap size={12} className="sm:w-[14px] sm:h-[14px]" /> Story
          </h4>
          <p className="text-xs sm:text-sm text-[#4A5A6A] leading-relaxed">
            {"I'm a passionate developer who loves building beautiful, performant web applications. Started coding at 15, fell in love with the web, and haven't looked back since. I believe great software is at the intersection of engineering excellence and thoughtful design."}
          </p>
        </div>
        <div className="rounded-xl sm:rounded-2xl bg-white/60 p-3 sm:p-5">
          <h4 className="text-xs sm:text-sm font-bold text-[#3B9BD9] uppercase tracking-wide flex items-center gap-1.5 mb-2 sm:mb-3">
            <Heart size={12} className="sm:w-[14px] sm:h-[14px]" /> Interests
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              "Open Source",
              "UI/UX Design",
              "Game Dev",
              "Music Production",
              "Photography",
              "Retro Gaming",
              "Coffee",
              "3D Art",
            ].map((interest) => (
              <span
                key={interest}
                className="rounded-full bg-[#3B9BD9]/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#3B9BD9]"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="wii-slide-up" style={{ animationDelay: "200ms" }}>
        <h4 className="text-xs sm:text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-2 sm:mb-3">
          Timeline
        </h4>
        <div className="space-y-2 sm:space-y-3">
          {[
            { year: "2024", title: "Senior Developer @ TechCo", desc: "Leading frontend architecture" },
            { year: "2022", title: "Full-Stack Developer @ StartupX", desc: "Built core product from 0 to 1" },
            { year: "2020", title: "Frontend Developer @ Agency", desc: "Shipped 20+ client projects" },
            { year: "2019", title: "CS Degree", desc: "University of Technology" },
          ].map((item) => (
            <div key={item.year} className="flex gap-3 sm:gap-4 rounded-lg sm:rounded-xl bg-white/50 p-2.5 sm:p-3">
              <span className="text-xs sm:text-sm font-bold text-[#3B9BD9] shrink-0 w-10 sm:w-12">
                {item.year}
              </span>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-[#2A3A4A] truncate">{item.title}</div>
                <div className="text-[10px] sm:text-xs text-[#7A8A9A]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
