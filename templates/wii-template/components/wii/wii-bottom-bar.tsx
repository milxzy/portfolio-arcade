"use client"

import { useEffect, useState } from "react"

export function WiiBottomBar() {
  const [time, setTime] = useState({ hours: "", minutes: "", ampm: "" })
  const [dateStr, setDateStr] = useState("")

  useEffect(() => {
    function update() {
      const now = new Date()
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const day = days[now.getDay()]
      const month = now.getMonth() + 1
      const date = now.getDate()
      let hours = now.getHours()
      const ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12 || 12
      const minutes = String(now.getMinutes()).padStart(2, "0")
      setTime({ hours: String(hours), minutes, ampm })
      setDateStr(`${day} ${month}/${date}`)
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      {/* The actual bottom bar area */}
      <div className="relative flex items-center justify-between px-2 sm:px-3 md:px-6 h-[64px] sm:h-[72px] md:h-[80px]"
        style={{
          background: "linear-gradient(180deg, rgba(190,198,210,0.0) 0%, rgba(180,190,204,0.6) 20%, rgba(170,180,194,0.85) 100%)",
        }}
      >
        {/* Thin separator line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a0aab8] to-transparent" />

        {/* Left side - Wii button + SD card */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          {/* Wii circular button */}
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px] rounded-full transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(180deg, #60B8E0 0%, #3A96C8 50%, #2A7AAA 100%)",
              boxShadow:
                "0 2px 6px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.15)",
            }}
            aria-label="Wii Menu"
          >
            <span className="text-white font-extrabold text-xs sm:text-sm md:text-base tracking-tight" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
              Wii
            </span>
          </button>

          {/* SD card icon - hidden on very small screens */}
          <button
            type="button"
            className="hidden sm:flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded transition-transform hover:scale-105"
            aria-label="SD Card"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="2" width="16" height="20" rx="2" stroke="#7A8A9A" strokeWidth="1.5" fill="none" />
              <path d="M4 2h10l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V2z" stroke="#7A8A9A" strokeWidth="1.5" fill="none" />
              <line x1="9" y1="6" x2="9" y2="11" stroke="#7A8A9A" strokeWidth="1" />
              <line x1="12" y1="6" x2="12" y2="11" stroke="#7A8A9A" strokeWidth="1" />
              <line x1="15" y1="6" x2="15" y2="9" stroke="#7A8A9A" strokeWidth="1" />
            </svg>
          </button>
        </div>

        {/* Center - Large time + date */}
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-0.5">
            <span
              className="font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                color: "#3A4555",
                textShadow: "0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {time.hours}:{time.minutes}
            </span>
            <span
              className="font-bold ml-0.5 sm:ml-1"
              style={{
                fontSize: "clamp(0.6rem, 1.3vw, 0.85rem)",
                color: "#5A6A7A",
              }}
            >
              {time.ampm}
            </span>
          </div>
          <span
            className="font-bold -mt-0.5"
            style={{
              fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)",
              color: "#6A7A8A",
              textShadow: "0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            {dateStr}
          </span>
        </div>

        {/* Right side - Mail icon */}
        <button
          type="button"
          className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 md:w-[52px] md:h-[52px] rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(180deg, #60B8E0 0%, #3A96C8 50%, #2A7AAA 100%)",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 2px rgba(0,0,0,0.15)",
          }}
          aria-label="Messages"
        >
          <svg width="18" height="14" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-4">
            <rect x="1" y="1" width="18" height="14" rx="2" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M1 3L10 9L19 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
