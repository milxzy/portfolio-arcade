"use client"

import { useCallback, useRef, useEffect } from "react"

// PS3-style sound effects using Web Audio API
export function useSoundEffects(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context on first interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
    }
    
    // Initialize on user interaction to comply with browser autoplay policies
    window.addEventListener("click", initAudio, { once: true })
    window.addEventListener("keydown", initAudio, { once: true })
    window.addEventListener("touchstart", initAudio, { once: true })
    
    return () => {
      window.removeEventListener("click", initAudio)
      window.removeEventListener("keydown", initAudio)
      window.removeEventListener("touchstart", initAudio)
    }
  }, [])

  // Play a tone with given frequency and duration
  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.1) => {
    if (!enabled) return
    
    // Lazy init audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    
    const ctx = audioContextRef.current
    if (ctx.state === "suspended") {
      ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    
    // Envelope: quick attack, sustain, quick release
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01)
    gainNode.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + duration * 0.3)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [enabled])

  // Navigation sound - subtle blip when moving between items
  const playNavigate = useCallback(() => {
    playTone(800, 0.06, "sine", 0.08)
  }, [playTone])

  // Category change sound - slightly different tone for horizontal movement
  const playCategoryChange = useCallback(() => {
    playTone(600, 0.08, "sine", 0.1)
    setTimeout(() => playTone(900, 0.06, "sine", 0.06), 30)
  }, [playTone])

  // Select/confirm sound - two-tone blip
  const playSelect = useCallback(() => {
    playTone(700, 0.08, "sine", 0.12)
    setTimeout(() => playTone(1000, 0.1, "sine", 0.1), 50)
  }, [playTone])

  // Back/cancel sound - descending tone
  const playBack = useCallback(() => {
    playTone(600, 0.08, "sine", 0.1)
    setTimeout(() => playTone(400, 0.1, "sine", 0.08), 50)
  }, [playTone])

  // Toggle sound - quick chirp
  const playToggle = useCallback(() => {
    playTone(1200, 0.05, "sine", 0.08)
  }, [playTone])

  return {
    playNavigate,
    playCategoryChange,
    playSelect,
    playBack,
    playToggle,
  }
}
