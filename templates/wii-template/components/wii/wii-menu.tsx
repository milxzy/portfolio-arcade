"use client"

import { useCallback, useEffect, useState } from "react"
import { WiiStartup } from "./wii-startup"
import { WiiBackground } from "./wii-background"
import { WiiCursor } from "./wii-cursor"
import { WiiBottomBar } from "./wii-bottom-bar"
import { WiiHomeMenu } from "./wii-home-menu"
import { ChannelGrid } from "./channel-grid"
import { ChannelDetail } from "./channel-detail"

type View = "startup" | "menu" | "channel"

export function WiiMenu() {
  const [view, setView] = useState<View>("startup")
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const [showHomeMenu, setShowHomeMenu] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [showFlash, setShowFlash] = useState(false)

  const handleStartupComplete = useCallback(() => {
    setView("menu")
  }, [])

  const openChannel = useCallback((id: string) => {
    // Flash transition
    setShowFlash(true)
    setTransitioning(true)
    setTimeout(() => {
      setActiveChannel(id)
      setView("channel")
      setTimeout(() => {
        setShowFlash(false)
        setTransitioning(false)
      }, 300)
    }, 250)
  }, [])

  const backToMenu = useCallback(() => {
    setShowFlash(true)
    setTransitioning(true)
    setShowHomeMenu(false)
    setTimeout(() => {
      setActiveChannel(null)
      setView("menu")
      setTimeout(() => {
        setShowFlash(false)
        setTransitioning(false)
      }, 300)
    }, 250)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showHomeMenu) {
          setShowHomeMenu(false)
        } else if (view === "channel") {
          backToMenu()
        }
      }
      if (e.key === "Home" || (e.key === "h" && e.ctrlKey)) {
        e.preventDefault()
        if (view === "channel") {
          setShowHomeMenu(true)
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [view, showHomeMenu, backToMenu])

  return (
    <div className="relative h-screen w-screen overflow-hidden wii-cursor-area select-none">
      {/* Custom cursor */}
      <WiiCursor />

      {/* Startup */}
      {view === "startup" && (
        <WiiStartup onComplete={handleStartupComplete} />
      )}

      {/* Background - always present under menu */}
      {view !== "startup" && <WiiBackground />}

      {/* Main menu */}
      {view === "menu" && (
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-[80px]">
          {/* Channel grid */}
          <div className="wii-slide-up">
            <ChannelGrid onOpenChannel={openChannel} />
          </div>

          {/* Bottom bar */}
          <WiiBottomBar />
        </div>
      )}

      {/* Channel detail view */}
      {view === "channel" && activeChannel && (
        <ChannelDetail
          channelId={activeChannel}
          onBack={backToMenu}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
      )}

      {/* White flash overlay for transitions */}
      {showFlash && (
        <div
          className="fixed inset-0 z-[60] bg-white wii-flash-in pointer-events-none"
          style={{ opacity: transitioning ? 1 : 0, transition: "opacity 0.3s ease" }}
        />
      )}

      {/* Home menu overlay */}
      {showHomeMenu && (
        <WiiHomeMenu
          onClose={() => setShowHomeMenu(false)}
          onBackToMenu={backToMenu}
        />
      )}
    </div>
  )
}
