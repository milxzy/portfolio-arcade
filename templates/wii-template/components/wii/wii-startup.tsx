"use client"

import { useEffect, useState } from "react"

export function WiiStartup({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"black" | "logo" | "fade">("black")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 400)
    const t2 = setTimeout(() => setPhase("fade"), 2200)
    const t3 = setTimeout(() => onComplete(), 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: phase === "black" ? "#000" : "#fff",
        opacity: phase === "fade" ? 0 : 1,
        transition:
          phase === "fade"
            ? "opacity 0.6s ease-out"
            : "background-color 0.3s ease",
      }}
    >
      {phase !== "black" && (
        <div
          className="flex flex-col items-center gap-3"
          style={{
            opacity: phase === "logo" ? 1 : 0,
            transform: phase === "logo" ? "scale(1)" : "scale(0.8)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <svg width="120" height="50" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="40" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="42" fill="#8B8B8B" letterSpacing="-1">
              Wii
            </text>
          </svg>
          <div className="h-0.5 w-16 rounded-full bg-[#8B8B8B] opacity-40" />
        </div>
      )}
    </div>
  )
}
