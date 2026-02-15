"use client"

import { useEffect, useMemo } from "react"
import type { XMBItem } from "@/lib/xmb-data"
import { ArrowLeft, ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

// Normalize markdown content - handles Windows line endings
function normalizeMarkdown(content: string | undefined): string {
  if (!content) return "";
  // Normalize Windows line endings to Unix style
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

interface ItemDetailProps {
  item: XMBItem
  categoryId: string
  onBack: () => void
}

export function ItemDetail({ item, categoryId, onBack }: ItemDetailProps) {
  // Normalize the markdown content
  const normalizedDescription = useMemo(
    () => normalizeMarkdown(item.description),
    [item.description]
  )
  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // check if user is typing in an input field
      const activeElement = document.activeElement;
      const isInInput = activeElement instanceof HTMLInputElement || 
                       activeElement instanceof HTMLTextAreaElement ||
                       activeElement?.tagName === 'INPUT' ||
                       activeElement?.tagName === 'TEXTAREA';
      
      if (e.key === "Escape" || (e.key === "Backspace" && !isInInput)) {
        e.preventDefault()
        onBack()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onBack])

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center animate-in fade-in duration-300">
      {/* Semi-transparent backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onBack}
        onKeyDown={(e) => e.key === "Enter" && onBack()}
        role="button"
        tabIndex={-1}
        aria-label="Close detail view"
      />

      {/* Content Panel */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col rounded-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-400"
        style={{
          background: "linear-gradient(180deg, rgba(20,25,40,0.95) 0%, rgba(10,12,20,0.98) 100%)",
          border: "1px solid rgba(60,120,220,0.15)",
          boxShadow: "0 0 40px rgba(40,80,180,0.1), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={item.label}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: "1px solid rgba(60,120,220,0.1)",
            background: "linear-gradient(90deg, rgba(40,80,180,0.08) 0%, transparent 100%)",
          }}
        >
          <div className="flex flex-col gap-1">
            <h2
              className="text-lg font-medium tracking-wide"
              style={{ color: "#e8e8e8" }}
            >
              {item.label}
            </h2>
            {item.subtitle && (
              <p
                className="text-xs tracking-wider"
                style={{ color: "rgba(160,180,220,0.7)" }}
              >
                {item.subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs tracking-wider transition-colors duration-200 hover:bg-[rgba(60,120,220,0.1)]"
            style={{ color: "rgba(160,180,220,0.6)" }}
            aria-label="Go back"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">BACK</span>
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto flex-1">
          {/* Description with Markdown */}
          {item.description && (
            <div
              className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
              style={{ color: "rgba(200,200,200,0.8)" }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-xl font-bold mb-3 mt-4 pb-2" style={{ color: "#e8e8e8", borderBottom: "1px solid rgba(60,120,220,0.2)" }} {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-lg font-semibold mb-2 mt-3 pb-1" style={{ color: "#d0d0d0", borderBottom: "1px solid rgba(60,120,220,0.1)" }} {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-base font-medium mb-2 mt-2" style={{ color: "#c0c0c0" }} {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-sm font-medium mb-2 mt-2" style={{ color: "#b0b0b0" }} {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-4 leading-7" style={{ color: "rgba(200,200,200,0.8)" }} {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 mb-4 space-y-1" style={{ color: "rgba(200,200,200,0.8)" }} {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5 mb-4 space-y-1" style={{ color: "rgba(200,200,200,0.8)" }} {...props} />
                  ),
                  li: ({ node, children, ...props }) => (
                    <li className="pl-1" style={{ color: "rgba(200,200,200,0.8)" }} {...props}>{children}</li>
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className?.includes("language-")
                    return isInline ? (
                      <code
                        className="px-1.5 py-0.5 rounded text-xs font-mono"
                        style={{
                          backgroundColor: "rgba(60,120,220,0.15)",
                          color: "rgba(160,190,240,0.95)",
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className="block px-3 py-2 rounded text-xs font-mono overflow-x-auto"
                        style={{
                          backgroundColor: "rgba(20,25,40,0.6)",
                          color: "rgba(180,200,240,0.9)",
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  pre: ({ node, ...props }) => (
                    <pre
                      className="mb-4 p-4 rounded overflow-x-auto"
                      style={{
                        backgroundColor: "rgba(20,25,40,0.6)",
                        border: "1px solid rgba(60,120,220,0.15)",
                      }}
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="underline hover:no-underline"
                      style={{ color: "rgba(100,160,240,0.9)" }}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-2 pl-4 my-4"
                      style={{
                        borderColor: "rgba(60,120,220,0.3)",
                        color: "rgba(180,180,200,0.7)",
                      }}
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong style={{ color: "#e0e0e0", fontWeight: 600 }} {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em style={{ color: "rgba(200,200,200,0.85)" }} {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-6" style={{ borderColor: "rgba(60,120,220,0.2)" }} {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border-collapse" style={{ border: "1px solid rgba(60,120,220,0.2)" }} {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead style={{ backgroundColor: "rgba(60,120,220,0.1)" }} {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="px-3 py-2 text-left text-xs font-semibold" style={{ border: "1px solid rgba(60,120,220,0.2)", color: "#e0e0e0" }} {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-3 py-2 text-xs" style={{ border: "1px solid rgba(60,120,220,0.2)", color: "rgba(200,200,200,0.8)" }} {...props} />
                  ),
                  del: ({ node, ...props }) => (
                    <del style={{ color: "rgba(150,150,150,0.6)" }} {...props} />
                  ),
                  input: ({ node, ...props }) => (
                    <input
                      className="mr-2"
                      style={{ accentColor: "rgba(100,160,240,0.9)" }}
                      disabled
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      className="max-w-full h-auto rounded my-4"
                      {...props}
                    />
                  ),
                }}
              >
                {normalizedDescription}
              </ReactMarkdown>
            </div>
          )}

          {/* Tags / Tech Stack */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <span
                className="text-[10px] tracking-widest uppercase font-mono"
                style={{ color: "rgba(100,140,200,0.5)" }}
              >
                {categoryId === "projects" ? "Tech Stack" : "Technologies"}
              </span>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-sm tracking-wide"
                    style={{
                      backgroundColor: "rgba(60,120,220,0.1)",
                      color: "rgba(160,190,240,0.85)",
                      border: "1px solid rgba(60,120,220,0.15)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Date */}
          {item.date && (
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] tracking-widest uppercase font-mono"
                style={{ color: "rgba(100,140,200,0.5)" }}
              >
                Year
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: "rgba(200,200,200,0.6)" }}
              >
                {item.date}
              </span>
            </div>
          )}

          {/* Links */}
          {item.links && item.links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {item.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs tracking-wider transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "rgba(60,120,220,0.12)",
                    color: "rgba(160,190,240,0.9)",
                    border: "1px solid rgba(60,120,220,0.2)",
                  }}
                >
                  <ExternalLink size={12} />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          className="px-6 py-3 flex items-center justify-end"
          style={{
            borderTop: "1px solid rgba(60,120,220,0.08)",
          }}
        >
          <span
            className="text-[10px] tracking-widest uppercase font-mono"
            style={{ color: "rgba(120,120,120,0.4)" }}
          >
            ESC to go back
          </span>
        </div>
      </div>
    </div>
  )
}
