"use client"

import { MapPin, Calendar, Heart, Zap } from "lucide-react"

export function AboutView() {
  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="wii-slide-up flex items-center gap-5">
        {/* Mii-style avatar */}
        <div className="w-24 h-24 rounded-full bg-white/80 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <h3 className="text-xl font-bold text-[#2A3A4A]">Developer Mii</h3>
          <p className="text-sm text-[#5A6A7A] mt-0.5">
            Full-Stack Developer & Creative Technologist
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-[#7A8A9A]">
              <MapPin size={12} /> San Francisco, CA
            </span>
            <span className="flex items-center gap-1 text-xs text-[#7A8A9A]">
              <Calendar size={12} /> 5+ years
            </span>
          </div>
        </div>
      </div>

      {/* Bio sections */}
      <div className="wii-slide-up grid grid-cols-1 md:grid-cols-2 gap-4" style={{ animationDelay: "100ms" }}>
        <div className="rounded-2xl bg-white/60 p-5">
          <h4 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <Zap size={14} /> Story
          </h4>
          <p className="text-sm text-[#4A5A6A] leading-relaxed">
            {"I'm a passionate developer who loves building beautiful, performant web applications. Started coding at 15, fell in love with the web, and haven't looked back since. I believe great software is at the intersection of engineering excellence and thoughtful design."}
          </p>
        </div>
        <div className="rounded-2xl bg-white/60 p-5">
          <h4 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide flex items-center gap-1.5 mb-3">
            <Heart size={14} /> Interests
          </h4>
          <div className="flex flex-wrap gap-2">
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
                className="rounded-full bg-[#3B9BD9]/10 px-3 py-1 text-xs font-semibold text-[#3B9BD9]"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="wii-slide-up" style={{ animationDelay: "200ms" }}>
        <h4 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-3">
          Timeline
        </h4>
        <div className="space-y-3">
          {[
            { year: "2024", title: "Senior Developer @ TechCo", desc: "Leading frontend architecture" },
            { year: "2022", title: "Full-Stack Developer @ StartupX", desc: "Built core product from 0 to 1" },
            { year: "2020", title: "Frontend Developer @ Agency", desc: "Shipped 20+ client projects" },
            { year: "2019", title: "CS Degree", desc: "University of Technology" },
          ].map((item) => (
            <div key={item.year} className="flex gap-4 rounded-xl bg-white/50 p-3">
              <span className="text-sm font-bold text-[#3B9BD9] shrink-0 w-12">
                {item.year}
              </span>
              <div>
                <div className="text-sm font-bold text-[#2A3A4A]">{item.title}</div>
                <div className="text-xs text-[#7A8A9A]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
