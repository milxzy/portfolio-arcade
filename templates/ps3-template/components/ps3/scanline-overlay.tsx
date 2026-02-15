"use client"

export function ScanlineOverlay({ enabled }: { enabled: boolean }) {
  if (!enabled) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        zIndex: 9999,
      }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 1px,
            rgba(0, 0, 0, 0.3) 1px,
            rgba(0, 0, 0, 0.3) 2px
          )`,
          backgroundSize: "100% 2px",
        }}
      />
      {/* Slight color tint and flicker simulation */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 20, 40, 0.05)",
        }}
      />
      {/* Vignette effect - darker edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)`,
        }}
      />
    </div>
  )
}
