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
    <div className="space-y-6">
      <div className="wii-slide-up">
        <h3 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-3">
          Preferences
        </h3>
        <div className="space-y-3">
          {/* Sound toggle */}
          <div className="flex items-center justify-between rounded-2xl bg-white/60 p-4">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 size={20} className="text-[#3B9BD9]" />
              ) : (
                <VolumeX size={20} className="text-[#AAB8C8]" />
              )}
              <div>
                <div className="text-sm font-bold text-[#2A3A4A]">Sound Effects</div>
                <div className="text-xs text-[#7A8A9A]">Click sounds and transitions</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                soundEnabled ? "bg-[#3B9BD9]" : "bg-[#C8D6E5]"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  soundEnabled ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Display info */}
          <div className="flex items-center justify-between rounded-2xl bg-white/60 p-4">
            <div className="flex items-center gap-3">
              <Monitor size={20} className="text-[#3B9BD9]" />
              <div>
                <div className="text-sm font-bold text-[#2A3A4A]">Display</div>
                <div className="text-xs text-[#7A8A9A]">Optimized for your screen</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#7A8A9A] bg-white/60 rounded-full px-3 py-1">Auto</span>
          </div>

          {/* Mobile note */}
          <div className="flex items-center justify-between rounded-2xl bg-white/60 p-4">
            <div className="flex items-center gap-3">
              <Smartphone size={20} className="text-[#3B9BD9]" />
              <div>
                <div className="text-sm font-bold text-[#2A3A4A]">Navigation</div>
                <div className="text-xs text-[#7A8A9A]">Arrow keys, Enter, Escape</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="wii-slide-up" style={{ animationDelay: "100ms" }}>
        <h3 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-3">
          About This Portfolio
        </h3>
        <div className="rounded-2xl bg-white/60 p-5">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-[#3B9BD9] mt-0.5 shrink-0" />
            <div className="space-y-2 text-sm text-[#4A5A6A] leading-relaxed">
              <p>
                This portfolio is inspired by the Nintendo Wii Channel Menu interface. 
                Built with Next.js, TypeScript, and Tailwind CSS.
              </p>
              <p className="text-xs text-[#7A8A9A]">
                {"Wii would like to play."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
