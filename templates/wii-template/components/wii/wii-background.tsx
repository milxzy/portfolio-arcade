"use client"

import { useEffect, useState } from "react"

export function WiiBackground() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  const offsetX = (mousePos.x - 0.5) * 10
  const offsetY = (mousePos.y - 0.5) * 8

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main Wii gray gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #E8ECF0 0%, #D8DDE3 30%, #C8CED6 70%, #BCC3CC 100%)",
        }}
      />

      {/* Very subtle light orb for depth */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.12]"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 60%)",
          top: `calc(-10% + ${offsetY}px)`,
          left: `calc(30% + ${offsetX}px)`,
          transition: "top 0.4s ease-out, left 0.4s ease-out",
        }}
      />

      {/* Subtle diagonal stripe pattern like the Wii menu background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="wii-stripes"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke="#888" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wii-stripes)" />
      </svg>
    </div>
  )
}
