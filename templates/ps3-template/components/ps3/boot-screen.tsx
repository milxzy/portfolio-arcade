"use client"

import { useEffect, useState } from "react"

interface BootScreenProps {
  onComplete: () => void
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<"black" | "wave" | "text" | "fade">("black")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("wave"), 400)
    const t2 = setTimeout(() => setPhase("text"), 1200)
    const t3 = setTimeout(() => setPhase("fade"), 3000)
    const t4 = setTimeout(() => onComplete(), 3600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "#000" }}
    >
      {/* Centered wave ring animation */}
      <div className="relative flex items-center justify-center">
        <div
          className={`absolute w-32 h-32 rounded-full transition-all duration-1000 ${
            phase === "black"
              ? "scale-0 opacity-0"
              : "scale-100 opacity-100"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(40,100,200,0.3) 0%, rgba(40,100,200,0) 70%)",
          }}
        />
        <div
          className={`absolute w-48 h-48 rounded-full transition-all duration-1000 delay-200 ${
            phase === "black"
              ? "scale-0 opacity-0"
              : "scale-100 opacity-40"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(60,130,220,0.15) 0%, rgba(60,130,220,0) 70%)",
          }}
        />

        {/* PS3-style text */}
        <div
          className={`relative flex flex-col items-center gap-3 transition-all duration-700 ${
            phase === "text" || phase === "fade"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-baseline gap-1">
            <span
              className="text-4xl font-light tracking-widest"
              style={{ color: "#e8e8e8" }}
            >
              PORTFOLIO
            </span>
            <span
              className="text-sm font-bold tracking-tight"
              style={{ color: "#4a90d9" }}
            >
              OS
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#4a90d9", borderTopColor: "transparent" }}
            />
            <span
              className="text-xs tracking-wider uppercase"
              style={{ color: "#888" }}
            >
              Loading system...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
