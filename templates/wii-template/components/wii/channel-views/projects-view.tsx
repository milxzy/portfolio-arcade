"use client"

import { type Project } from "@/lib/channels"
import { loadPortfolioData, getProjectsByCategory } from "@/lib/load-portfolio-data"
import { ExternalLink, Github, Play } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

// Normalize markdown content - handles Windows line endings
function normalizeMarkdown(content: string | undefined): string {
  if (!content) return "";
  // Normalize Windows line endings to Unix style
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function ProjectsView({
  filter,
}: {
  filter?: string
}) {
  const [selected, setSelected] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  
  // Normalize the selected project's description
  const normalizedDescription = useMemo(
    () => normalizeMarkdown(selected?.description),
    [selected?.description]
  )

  // Load projects from portfolio.json on mount
  useEffect(() => {
    loadPortfolioData().then((data) => {
      setProjects(data.projects)
    })
  }, [])

  const filtered = filter
    ? getProjectsByCategory(projects, filter)
    : projects

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-full">
      {/* Project grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 auto-rows-min">
        {filtered.map((project, i) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelected(project)}
            className={`wii-slide-up relative flex flex-col items-start gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left transition-all ${
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#3B9BD9]/15 flex items-center justify-center text-[#3B9BD9] font-bold text-xs sm:text-sm">
              {project.title.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#2A3A4A]">
                {project.title}
              </div>
              <div className="text-[10px] sm:text-xs text-[#6A7A8A] line-clamp-2">{project.tagline}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel - shows as a sticky bottom sheet on mobile when selected */}
      <div className={`lg:w-80 shrink-0 ${selected ? 'fixed lg:static bottom-0 left-0 right-0 z-40 lg:z-auto p-3 sm:p-0' : ''}`}>
        {selected ? (
          <div className="wii-slide-up rounded-2xl bg-white/95 lg:bg-white/70 backdrop-blur-sm p-4 sm:p-5 shadow-lg lg:shadow-sm max-h-[60vh] lg:max-h-none overflow-y-auto">
            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="lg:hidden absolute top-3 right-3 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center"
              aria-label="Close"
            >
              <span className="text-[#4A5A6A] text-lg leading-none">&times;</span>
            </button>
            
            <h3 className="text-base sm:text-lg font-bold text-[#2A3A4A] pr-8 lg:pr-0">
              {selected.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6A7A] mt-1">{selected.tagline}</p>
            <div className="text-xs sm:text-sm text-[#4A5A6A] mt-2 sm:mt-3 leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-base font-bold mb-2 mt-3 pb-1 border-b border-[#2A3A4A]/20 text-[#2A3A4A]" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-sm font-semibold mb-2 mt-2 pb-1 border-b border-[#2A3A4A]/10 text-[#3A4A5A]" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xs font-medium mb-1 mt-2 text-[#4A5A6A]" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xs font-medium mb-1 mt-2 text-[#5A6A7A]" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-3 text-[#4A5A6A] leading-6" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-4 mb-3 space-y-1 text-[#4A5A6A]" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-4 mb-3 space-y-1 text-[#4A5A6A]" {...props} />
                  ),
                  li: ({ node, children, ...props }) => (
                    <li className="text-[#4A5A6A] pl-1" {...props}>{children}</li>
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className?.includes("language-");
                    return isInline ? (
                      <code
                        className="px-1 py-0.5 rounded text-xs font-mono bg-[#3B9BD9]/10 text-[#3B9BD9]"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className="block px-2 py-1.5 rounded text-xs font-mono bg-[#2A3A4A]/10 text-[#3A4A5A] overflow-x-auto"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ node, ...props }) => (
                    <pre
                      className="mb-3 p-2 rounded overflow-x-auto bg-[#2A3A4A]/5 border border-[#2A3A4A]/10"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-[#3B9BD9] hover:text-[#2E8BC0] underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-2 border-[#3B9BD9]/50 pl-3 my-3 text-[#5A6A7A]"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-[#3A4A5A]" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-[#5A6A7A]" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-4 border-[#2A3A4A]/20" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto mb-3">
                      <table className="min-w-full border-collapse border border-[#2A3A4A]/20 rounded text-xs" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-[#3B9BD9]/10" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-[#2A3A4A]/20 px-2 py-1 text-left font-semibold text-[#2A3A4A]" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-[#2A3A4A]/20 px-2 py-1 text-[#4A5A6A]" {...props} />
                  ),
                  del: ({ node, ...props }) => (
                    <del className="text-[#7A8A9A] line-through" {...props} />
                  ),
                  input: ({ node, ...props }) => (
                    <input
                      className="mr-1 accent-[#3B9BD9]"
                      disabled
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      className="max-w-full h-auto rounded my-2"
                      {...props}
                    />
                  ),
                }}
              >
                {normalizedDescription}
              </ReactMarkdown>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-3 sm:mt-4">
              {selected.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-[#3B9BD9]/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-[#3B9BD9]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
              {selected.liveUrl && (
                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-[#3B9BD9] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#2E8BC0] transition-colors"
                >
                  <Play size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Demo
                </a>
              )}
              {selected.githubUrl && (
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-[#2A3A4A] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#1A2A3A] transition-colors"
                >
                  <Github size={12} className="sm:w-[14px] sm:h-[14px]" />
                  Code
                </a>
              )}
              {selected.liveUrl && (
                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 text-[#5A6A7A] hover:bg-white transition-colors"
                >
                  <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px]" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center h-40 rounded-2xl bg-white/40 text-sm text-[#7A8A9A] font-semibold">
            Select a project to preview
          </div>
        )}
      </div>
      
      {/* Backdrop for mobile detail panel */}
      {selected && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setSelected(null)}
        />
      )}
    </div>
  )
}
