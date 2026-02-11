"use client"

import { projects, type Project } from "@/lib/channels"
import { ExternalLink, Github, Play } from "lucide-react"
import { useState } from "react"

export function ProjectsView({
  filter,
}: {
  filter?: string
}) {
  const [selected, setSelected] = useState<Project | null>(null)

  const filtered = filter
    ? projects.filter((p) => p.category.includes(filter))
    : projects

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Project grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-min">
        {filtered.map((project, i) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelected(project)}
            className={`wii-slide-up relative flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-all ${
              selected?.id === project.id
                ? "bg-[#3B9BD9]/20 ring-2 ring-[#3B9BD9]/50"
                : "bg-white/60 hover:bg-white/80"
            }`}
            style={{
              animationDelay: `${i * 60}ms`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {project.featured && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFD700]" />
            )}
            <div className="w-10 h-10 rounded-xl bg-[#3B9BD9]/15 flex items-center justify-center text-[#3B9BD9] font-bold text-sm">
              {project.title.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-[#2A3A4A]">
                {project.title}
              </div>
              <div className="text-xs text-[#6A7A8A]">{project.tagline}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="lg:w-80 shrink-0">
        {selected ? (
          <div className="wii-slide-up rounded-2xl bg-white/70 backdrop-blur-sm p-5 shadow-sm">
            <h3 className="text-lg font-bold text-[#2A3A4A]">
              {selected.title}
            </h3>
            <p className="text-sm text-[#5A6A7A] mt-1">{selected.tagline}</p>
            <p className="text-sm text-[#4A5A6A] mt-3 leading-relaxed">
              {selected.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {selected.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-[#3B9BD9]/10 px-2.5 py-0.5 text-xs font-semibold text-[#3B9BD9]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-5">
              {selected.liveUrl && (
                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-[#3B9BD9] px-4 py-2 text-sm font-bold text-white hover:bg-[#2E8BC0] transition-colors"
                >
                  <Play size={14} />
                  Demo
                </a>
              )}
              {selected.githubUrl && (
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-[#2A3A4A] px-4 py-2 text-sm font-bold text-white hover:bg-[#1A2A3A] transition-colors"
                >
                  <Github size={14} />
                  Code
                </a>
              )}
              {selected.liveUrl && (
                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 text-[#5A6A7A] hover:bg-white transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 rounded-2xl bg-white/40 text-sm text-[#7A8A9A] font-semibold">
            Select a project to preview
          </div>
        )}
      </div>
    </div>
  )
}
