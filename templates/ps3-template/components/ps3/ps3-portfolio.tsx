"use client"

import { useCallback, useState } from "react"
import type { UserProfile } from "@/lib/xmb-data"
import { BootScreen } from "./boot-screen"
import { WaveBackground } from "./wave-background"
import { XMBInterface } from "./xmb-interface"
import { ScanlineOverlay } from "./scanline-overlay"

export function PS3Portfolio() {
  const [booted, setBooted] = useState(false)
  const [profile, setProfile] = useState<UserProfile>("recruiter")
  const [colorIndex, setColorIndex] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [scanlines, setScanlines] = useState(false)
  const [waveIntensity, setWaveIntensity] = useState(1)

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  const handleProfileChange = useCallback((p: UserProfile) => {
    setProfile(p)
    // Change wave color based on profile
    const colorMap: Record<UserProfile, number> = {
      recruiter: 0,
      engineer: 3,
      stranger: 1,
    }
    setColorIndex(colorMap[p])
  }, [])

  return (
    <main
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#080810" }}
    >
      {/* Wave background - always present */}
      <WaveBackground intensity={waveIntensity} colorIndex={colorIndex} />

      {/* CRT Scanlines overlay */}
      <ScanlineOverlay enabled={scanlines} />

      {/* Boot screen or main interface */}
      {!booted ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : (
        <XMBInterface
          onProfileChange={handleProfileChange}
          onColorChange={setColorIndex}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled((v) => !v)}
          scanlines={scanlines}
          onScanlinesToggle={() => setScanlines((v) => !v)}
        />
      )}
    </main>
  )
}
