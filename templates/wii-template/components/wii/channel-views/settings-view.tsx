"use client"

import { Volume2, VolumeX, Monitor, Smartphone, Info } from "lucide-react"

export function SettingsView({
  soundEnabled,
  onToggleSound,
}: {
  soundEnabled: boolean
  onToggleSound: () => void
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="wii-slide-up">
        <h3 className="text-xs sm:text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-2 sm:mb-3">
          Preferences
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {/* Sound toggle */}
          <div className="flex items-center justify-between rounded-xl sm:rounded-2xl bg-white/60 p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {soundEnabled ? (
                <Volume2 size={18} className="text-[#3B9BD9] sm:w-5 sm:h-5" />
              ) : (
                <VolumeX size={18} className="text-[#AAB8C8] sm:w-5 sm:h-5" />
              )}
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#2A3A4A]">Sound Effects</div>
                <div className="text-[10px] sm:text-xs text-[#7A8A9A]">Click sounds and transitions</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`relative w-10 h-6 sm:w-12 sm:h-7 rounded-full transition-colors ${
                soundEnabled ? "bg-[#3B9BD9]" : "bg-[#C8D6E5]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm transition-transform ${
                  soundEnabled ? "left-[18px] sm:left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Display info */}
          <div className="flex items-center justify-between rounded-xl sm:rounded-2xl bg-white/60 p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Monitor size={18} className="text-[#3B9BD9] sm:w-5 sm:h-5" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#2A3A4A]">Display</div>
                <div className="text-[10px] sm:text-xs text-[#7A8A9A]">Optimized for your screen</div>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#7A8A9A] bg-white/60 rounded-full px-2 sm:px-3 py-0.5 sm:py-1">Auto</span>
          </div>

          {/* Mobile note */}
          <div className="flex items-center justify-between rounded-xl sm:rounded-2xl bg-white/60 p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Smartphone size={18} className="text-[#3B9BD9] sm:w-5 sm:h-5" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-[#2A3A4A]">Navigation</div>
                <div className="text-[10px] sm:text-xs text-[#7A8A9A]">Arrow keys, Enter, Escape</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="wii-slide-up" style={{ animationDelay: "100ms" }}>
        <h3 className="text-xs sm:text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-2 sm:mb-3">
          About This Portfolio
        </h3>
        <div className="rounded-xl sm:rounded-2xl bg-white/60 p-3 sm:p-5">
          <div className="flex items-start gap-2 sm:gap-3">
            <Info size={16} className="text-[#3B9BD9] mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" />
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#4A5A6A] leading-relaxed">
              <p>
                This portfolio is inspired by the Nintendo Wii Channel Menu interface. 
                Built with Next.js, TypeScript, and Tailwind CSS.
              </p>
              <p className="text-[10px] sm:text-xs text-[#7A8A9A]">
                {"Wii would like to play."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
