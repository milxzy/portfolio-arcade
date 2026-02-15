"use client"

import { useCallback, useRef, useEffect } from "react"

// Web Audio API based sound generation for Wii-style sounds
export function useWiiSound(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize AudioContext on first user interaction
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // Wii click/select sound - soft, bubbly click
  const playClick = useCallback(() => {
    if (!enabled) return
    
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Wii-style click: quick descending tone
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08)
      oscillator.type = "sine"
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.08)
    } catch (e) {
      // Audio not supported
    }
  }, [enabled, getAudioContext])

  // Wii hover sound - subtle, soft pop
  const playHover = useCallback(() => {
    if (!enabled) return
    
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Soft pop sound
      oscillator.frequency.setValueAtTime(600, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.04)
      oscillator.type = "sine"
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.04)
    } catch (e) {
      // Audio not supported
    }
  }, [enabled, getAudioContext])

  // Wii transition/whoosh sound
  const playTransition = useCallback(() => {
    if (!enabled) return
    
    try {
      const ctx = getAudioContext()
      
      // Create white noise for whoosh
      const bufferSize = ctx.sampleRate * 0.2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }
      
      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      
      // Bandpass filter to make it more "whooshy"
      const bandpass = ctx.createBiquadFilter()
      bandpass.type = "bandpass"
      bandpass.frequency.setValueAtTime(1000, ctx.currentTime)
      bandpass.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.15)
      bandpass.Q.value = 0.5
      
      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      
      whiteNoise.connect(bandpass)
      bandpass.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      whiteNoise.start(ctx.currentTime)
      whiteNoise.stop(ctx.currentTime + 0.2)
      
      // Add a subtle tone
      const oscillator = ctx.createOscillator()
      const toneGain = ctx.createGain()
      
      oscillator.connect(toneGain)
      toneGain.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(400, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15)
      oscillator.type = "sine"
      
      toneGain.gain.setValueAtTime(0.06, ctx.currentTime)
      toneGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.15)
    } catch (e) {
      // Audio not supported
    }
  }, [enabled, getAudioContext])

  // Wii back/cancel sound
  const playBack = useCallback(() => {
    if (!enabled) return
    
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Descending tone for back/cancel
      oscillator.frequency.setValueAtTime(500, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12)
      oscillator.type = "sine"
      
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.12)
    } catch (e) {
      // Audio not supported
    }
  }, [enabled, getAudioContext])

  // Startup chime - Wii-inspired
  const playStartup = useCallback(() => {
    if (!enabled) return
    
    try {
      const ctx = getAudioContext()
      
      // Play a simple ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      const noteDuration = 0.15
      
      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.frequency.value = freq
        oscillator.type = "sine"
        
        const startTime = ctx.currentTime + (i * noteDuration * 0.8)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + noteDuration)
      })
    } catch (e) {
      // Audio not supported
    }
  }, [enabled, getAudioContext])

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    playClick,
    playHover,
    playTransition,
    playBack,
    playStartup,
  }
}
