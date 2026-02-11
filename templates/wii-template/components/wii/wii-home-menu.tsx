"use client"

import { Home, X } from "lucide-react"

export function WiiHomeMenu({
  onClose,
  onBackToMenu,
}: {
  onClose: () => void
  onBackToMenu: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />

      {/* Menu panel */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 wii-slide-up"
        role="dialog"
        aria-label="Home Menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-white drop-shadow-md">HOME Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-bold text-white hover:bg-white/30 transition-colors"
          >
            <Home size={16} />
            Close
          </button>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 px-6 pb-6">
          <button
            type="button"
            onClick={onBackToMenu}
            className="flex items-center justify-center rounded-[2rem] bg-white/90 backdrop-blur-sm py-5 text-lg font-bold text-[#4A5A6A] shadow-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.05)",
            }}
          >
            Wii Menu
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-[2rem] bg-white/90 backdrop-blur-sm py-5 text-lg font-bold text-[#4A5A6A] shadow-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              boxShadow:
                "0 4px 20px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.05)",
            }}
          >
            Resume
          </button>
        </div>

        {/* Wii Remote Settings */}
        <div className="flex items-center justify-center pb-4">
          <span className="text-sm font-semibold text-white/70">
            Wii Remote Settings
          </span>
        </div>
      </div>
    </div>
  )
}
