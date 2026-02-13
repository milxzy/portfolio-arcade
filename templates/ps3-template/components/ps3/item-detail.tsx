"use client"

import { useEffect } from "react"
import type { XMBItem } from "@/lib/xmb-data"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface ItemDetailProps {
  item: XMBItem
  categoryId: string
  onBack: () => void
}

export function ItemDetail({ item, categoryId, onBack }: ItemDetailProps) {
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
        className="relative z-10 w-full max-w-2xl mx-4 rounded-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-400"
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

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Description */}
          {item.description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(200,200,200,0.8)" }}
            >
              {item.description}
            </p>
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
