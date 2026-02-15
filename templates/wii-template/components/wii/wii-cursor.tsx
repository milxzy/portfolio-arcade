"use client"

import { useEffect, useState, useRef } from "react"

export function WiiCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [clicking, setClicking] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const hasMouseMoved = useRef(false)

  useEffect(() => {
    // Always add the class to hide cursor immediately
    document.documentElement.classList.add('wii-cursor-active')

    const onMove = (e: MouseEvent) => {
      // If we get a mouse move, it's not a touch-only device
      if (!hasMouseMoved.current) {
        hasMouseMoved.current = true
        setIsTouchDevice(false)
      }
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }
    
    const onTouchStart = () => {
      // If touch is used, hide the custom cursor
      setIsTouchDevice(true)
      setVisible(false)
    }
    
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => {
      if (hasMouseMoved.current) setVisible(true)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchstart", onTouchStart)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      document.documentElement.classList.remove('wii-cursor-active')
    }
  }, [visible])

  // Don't show cursor on touch devices or when not visible
  if (!visible || isTouchDevice) return null

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: pos.x - 6,
        top: pos.y - 2,
        transform: clicking ? "scale(0.85)" : "scale(1)",
        transition: "transform 0.1s ease",
      }}
    >
      <svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* White glove hand pointer - Wii style */}
        <g filter="url(#shadow)">
          {/* Index finger */}
          <path d="M16 2C16 2 18 1 20 2C22 3 22 5 22 7L22 16C22 16 24 15 26 16C28 17 28 19 28 20C28 20 30 19 32 20C33.5 21 33.5 23 33 24.5C33 24.5 35 24 35 27C35 29 33 30 33 30L33 36C33 40 30 43 26 43L18 43C14 43 11 41 10 38L7 30C6 27 7 25 9 24L9 7C9 4 11 2 13 2C14.5 2 16 2 16 2Z" fill="white" stroke="#C8D6E5" strokeWidth="1.5"/>
          {/* Finger details */}
          <line x1="16" y1="6" x2="16" y2="16" stroke="#E0E7EE" strokeWidth="0.8" strokeLinecap="round"/>
          <line x1="22" y1="19" x2="22" y2="28" stroke="#E0E7EE" strokeWidth="0.8" strokeLinecap="round"/>
          <line x1="28" y1="22" x2="28" y2="29" stroke="#E0E7EE" strokeWidth="0.8" strokeLinecap="round"/>
        </g>
        <defs>
          <filter id="shadow" x="0" y="0" width="40" height="50" filterUnits="userSpaceOnUse">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.25"/>
          </filter>
        </defs>
      </svg>
    </div>
  )
}
