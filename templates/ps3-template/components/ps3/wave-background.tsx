"use client"

import { useEffect, useRef } from "react"

interface WaveBackgroundProps {
  intensity?: number
  colorIndex?: number
}

const COLOR_PALETTES = [
  { r: 30, g: 80, b: 180 },   // blue (default PS3)
  { r: 140, g: 40, b: 40 },   // red
  { r: 30, g: 120, b: 80 },   // green
  { r: 120, g: 60, b: 140 },  // purple
  { r: 40, g: 40, b: 40 },    // dark grey
]

export function WaveBackground({ intensity = 1, colorIndex = 0 }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener("resize", handleResize)

    const palette = COLOR_PALETTES[colorIndex % COLOR_PALETTES.length]
    const particleCount = Math.floor(120 * intensity)
    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      phase: number
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: height * 0.3 + Math.random() * height * 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
      })
    }

    let time = 0

    const animate = () => {
      time += 0.008
      ctx.clearRect(0, 0, width, height)

      // Draw gradient glow in the middle
      const glowGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.55,
        0,
        width * 0.5,
        height * 0.55,
        width * 0.6
      )
      glowGrad.addColorStop(0, `rgba(${palette.r + 40}, ${palette.g + 40}, ${palette.b + 40}, 0.08)`)
      glowGrad.addColorStop(0.5, `rgba(${palette.r}, ${palette.g}, ${palette.b}, 0.03)`)
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, width, height)

      // Draw flowing wave lines
      for (let w = 0; w < 5; w++) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${palette.r + 60}, ${palette.g + 60}, ${palette.b + 80}, ${0.06 + w * 0.015})`
        ctx.lineWidth = 1.5
        const baseY = height * (0.4 + w * 0.06)
        for (let x = 0; x <= width; x += 3) {
          const y =
            baseY +
            Math.sin(x * 0.003 + time + w * 0.7) * 30 * intensity +
            Math.sin(x * 0.007 + time * 1.3 + w) * 15 * intensity
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy + Math.sin(time + p.phase) * 0.2 * intensity

        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < height * 0.2) p.y = height * 0.8
        if (p.y > height * 0.85) p.y = height * 0.3

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${palette.r + 80}, ${palette.g + 80}, ${palette.b + 100}, ${p.alpha})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animRef.current)
    }
  }, [intensity, colorIndex])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
