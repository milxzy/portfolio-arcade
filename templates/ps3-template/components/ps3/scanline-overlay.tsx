"use client"

export function ScanlineOverlay({ enabled }: { enabled: boolean }) {
  if (!enabled) return null

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.03) 0px,
          rgba(0, 0, 0, 0.03) 1px,
          transparent 1px,
          transparent 3px
        )`,
        backgroundSize: "100% 3px",
      }}
    />
  )
}
