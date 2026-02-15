"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  loadPortfolioCategories,
  getProjectsForProfile,
  type PortfolioData,
} from "@/lib/load-portfolio-data"
import {
  type UserProfile,
  type XMBCategory,
  type XMBItem,
} from "@/lib/xmb-data"
import { XMBIcon } from "./xmb-icons"
import { ItemDetail } from "./item-detail"
import { useSoundEffects } from "@/hooks/use-sound-effects"

// Hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  
  return isMobile
}

interface XMBInterfaceProps {
  onProfileChange: (profile: UserProfile) => void
  onColorChange: (index: number) => void
  soundEnabled: boolean
  onSoundToggle: () => void
  scanlines: boolean
  onScanlinesToggle: () => void
  waveIntensity: number
  onWaveIntensityChange: (intensity: number) => void
}

export function XMBInterface({
  onProfileChange,
  onColorChange,
  soundEnabled,
  onSoundToggle,
  scanlines,
  onScanlinesToggle,
  waveIntensity,
  onWaveIntensityChange,
}: XMBInterfaceProps) {
  const [categories, setCategories] = useState<XMBCategory[]>([])
  const [catIndex, setCatIndex] = useState(0)
  const [itemIndices, setItemIndices] = useState<number[]>([])
  const [profile, setProfile] = useState<UserProfile>("recruiter")
  const [showDetail, setShowDetail] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  
  // Sound effects
  const { playNavigate, playCategoryChange, playSelect, playBack, playToggle } = useSoundEffects(soundEnabled)
  
  // Responsive sizing values
  const catWidth = isMobile ? 70 : 100
  const catIconSize = isMobile ? 28 : 36
  const catIconSizeInactive = isMobile ? 22 : 28
  const itemSpacing = isMobile ? 44 : 52
  const itemTopOffset = isMobile ? 32 : 40
  const itemAboveOffset = isMobile ? -70 : -90

  // Load portfolio data on mount
  useEffect(() => {
    loadPortfolioCategories().then((loadedCategories) => {
      setCategories(loadedCategories)
      setItemIndices(loadedCategories.map(() => 0))
    })
  }, [])

  // Build effective categories with profile-sorted projects
  const getEffectiveCategories = useCallback((): XMBCategory[] => {
    return categories.map((cat) => {
      if (cat.id === "projects") {
        return { ...cat, items: getProjectsForProfile(categories, profile) }
      }
      return cat
    })
  }, [profile, categories])

  const effectiveCategories = getEffectiveCategories()
  const currentCat = effectiveCategories[catIndex]
  const currentItemIndex = itemIndices[catIndex]
  const currentItem = currentCat?.items[currentItemIndex]

  // Get dynamic subtitle for settings items
  const getItemSubtitle = useCallback((item: XMBItem, categoryId: string): string => {
    if (categoryId === "settings") {
      if (item.id === "settings-sound") {
        return soundEnabled ? "ON - Sound effects enabled" : "OFF - Sound effects disabled"
      }
      if (item.id === "settings-scanlines") {
        return scanlines ? "ON - CRT effect active" : "OFF - CRT effect disabled"
      }
      if (item.id === "settings-particles") {
        // Round to avoid floating point issues with object key lookup
        const rounded = Math.round(waveIntensity * 10) / 10
        const intensityLabels: Record<number, string> = {
          0.3: "Very Low",
          0.6: "Low",
          1.0: "Medium",
          1.5: "High",
          2.0: "Very High",
        }
        const label = intensityLabels[rounded] || "Medium"
        return `${label} - Press Enter to cycle`
      }
    }
    return item.subtitle || ""
  }, [soundEnabled, scanlines, waveIntensity])

  // Clock
  const [clock, setClock] = useState("")
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(
        now.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        }) +
          "  " +
          now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
      )
    }
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  // Handle item selection
  const handleSelect = useCallback(() => {
    if (!currentItem) return

    // Handle user profile selection
    if (currentCat.id === "users") {
      const profileId = currentItem.id as UserProfile
      if (["recruiter", "engineer", "stranger"].includes(profileId)) {
        playSelect()
        setProfile(profileId)
        onProfileChange(profileId)
        // Move to projects category
        setCatIndex(1)
      }
      return
    }

    // Handle settings toggles
    if (currentCat.id === "settings") {
      playToggle()
      if (currentItem.id === "settings-sound") {
        onSoundToggle()
      } else if (currentItem.id === "settings-scanlines") {
        onScanlinesToggle()
      } else if (currentItem.id === "settings-particles") {
        // Cycle through intensity levels: 0.3 -> 0.6 -> 1.0 -> 1.5 -> 2.0 -> 0.3
        let nextIntensity: number
        if (waveIntensity < 0.5) nextIntensity = 0.6
        else if (waveIntensity < 0.8) nextIntensity = 1.0
        else if (waveIntensity < 1.3) nextIntensity = 1.5
        else if (waveIntensity < 1.8) nextIntensity = 2.0
        else nextIntensity = 0.3
        onWaveIntensityChange(nextIntensity)
      }
      return
    }

    // Open detail view for projects, tech, about
    playSelect()
    setShowDetail(true)
  }, [currentItem, currentCat, waveIntensity, onProfileChange, onSoundToggle, onScanlinesToggle, onWaveIntensityChange, playSelect, playToggle])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // check if user is typing in an input field
      const activeElement = document.activeElement;
      const isInInput = activeElement instanceof HTMLInputElement || 
                       activeElement instanceof HTMLTextAreaElement ||
                       activeElement?.tagName === 'INPUT' ||
                       activeElement?.tagName === 'TEXTAREA';
      
      if (showDetail) {
        if (e.key === "Escape" || (e.key === "Backspace" && !isInInput)) {
          e.preventDefault()
          playBack()
          setShowDetail(false)
        }
        return
      }

      switch (e.key) {
        case "ArrowLeft":
          if (!isInInput) {
            e.preventDefault()
            setTransitioning(true)
            setCatIndex((prev) => {
              const newIndex = Math.max(0, prev - 1)
              if (newIndex !== prev) {
                playCategoryChange()
                setItemIndices((indices) => {
                  const copy = [...indices]
                  copy[newIndex] = 0
                  return copy
                })
              }
              return newIndex
            })
          }
          setTimeout(() => setTransitioning(false), 150)
          break
        case "ArrowRight":
          if (!isInInput) {
            e.preventDefault()
            setTransitioning(true)
            setCatIndex((prev) => {
              const newIndex = Math.min(effectiveCategories.length - 1, prev + 1)
              if (newIndex !== prev) {
                playCategoryChange()
                setItemIndices((indices) => {
                  const copy = [...indices]
                  copy[newIndex] = 0
                  return copy
                })
              }
              return newIndex
            })
            setTimeout(() => setTransitioning(false), 150)
          }
          break
        case "ArrowUp":
          if (!isInInput) {
            e.preventDefault()
            playNavigate()
            setItemIndices((prev) => {
              const copy = [...prev]
              copy[catIndex] = Math.max(0, copy[catIndex] - 1)
              return copy
            })
          }
          break
        case "ArrowDown":
          if (!isInInput) {
            e.preventDefault()
            playNavigate()
            setItemIndices((prev) => {
              const copy = [...prev]
              copy[catIndex] = Math.min(
                currentCat.items.length - 1,
                copy[catIndex] + 1
              )
              return copy
            })
          }
          break
        case "Enter":
        case " ":
          if (!isInInput) {
            e.preventDefault()
            handleSelect()
          }
          break
        case "Escape":
        case "Backspace":
          if (!isInInput) {
            e.preventDefault()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [catIndex, effectiveCategories.length, currentCat?.items.length, showDetail, currentItem, playNavigate, playCategoryChange, playBack, handleSelect])

  // Touch / swipe handling
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchRef.current = { x: touch.clientX, y: touch.clientY }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchRef.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchRef.current.x
      const dy = touch.clientY - touchRef.current.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)
      const threshold = 40

      if (absDx > absDy && absDx > threshold) {
        // Horizontal swipe
        if (dx > 0) {
          setCatIndex((prev) => {
            const newIndex = Math.max(0, prev - 1)
            if (newIndex !== prev) {
              playCategoryChange()
              setItemIndices((indices) => {
                const copy = [...indices]
                copy[newIndex] = 0
                return copy
              })
            }
            return newIndex
          })
        } else {
          setCatIndex((prev) => {
            const newIndex = Math.min(effectiveCategories.length - 1, prev + 1)
            if (newIndex !== prev) {
              playCategoryChange()
              setItemIndices((indices) => {
                const copy = [...indices]
                copy[newIndex] = 0
                return copy
              })
            }
            return newIndex
          })
        }
      } else if (absDy > absDx && absDy > threshold) {
        // Vertical swipe
        playNavigate()
        if (dy > 0) {
          setItemIndices((prev) => {
            const copy = [...prev]
            copy[catIndex] = Math.max(0, copy[catIndex] - 1)
            return copy
          })
        } else {
          setItemIndices((prev) => {
            const copy = [...prev]
            copy[catIndex] = Math.min(currentCat.items.length - 1, copy[catIndex] + 1)
            return copy
          })
        }
      }

      touchRef.current = null
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })
    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [catIndex, effectiveCategories.length, currentCat?.items.length, playNavigate, playCategoryChange])

  if (showDetail && currentItem) {
    return (
      <ItemDetail
        item={currentItem}
        categoryId={currentCat.id}
        onBack={() => {
          playBack()
          setShowDetail(false)
        }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-10 flex flex-col select-none overflow-hidden"
      role="application"
      aria-label="XrossMediaBar Navigation"
    >
      {/* Top bar: clock + profile */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 z-20">
        <div
          className="text-[10px] sm:text-xs tracking-wider font-mono"
          style={{ color: "rgba(200,200,200,0.6)" }}
        >
          {profile.toUpperCase()} PROFILE
        </div>
        <time
          className="text-[10px] sm:text-xs tracking-wider font-mono"
          style={{ color: "rgba(200,200,200,0.6)" }}
          dateTime={new Date().toISOString()}
        >
          {clock}
        </time>
      </header>

      {/* Main XMB Area */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Horizontal Category Bar */}
        <nav
          className="absolute flex items-center gap-0"
          style={{
            transform: `translateX(${-catIndex * catWidth}px)`,
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            left: "50%",
            zIndex: 10,
          }}
          role="menubar"
          aria-label="Categories"
        >
          {effectiveCategories.map((cat, i) => {
            const isActive = i === catIndex
            const distance = Math.abs(i - catIndex)
            return (
              <button
                key={cat.id}
                className="flex flex-col items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300"
                style={{
                  width: `${catWidth}px`,
                  opacity: isActive ? 1 : Math.max(0.15, 0.5 - distance * 0.15),
                  transform: isActive ? "scale(1)" : `scale(${Math.max(0.6, 0.85 - distance * 0.08)})`,
                  filter: isActive ? "none" : "brightness(0.7)",
                }}
                onClick={() => {
                  setTransitioning(true)
                  if (i !== catIndex) {
                    setItemIndices((indices) => {
                      const copy = [...indices]
                      copy[i] = 0
                      return copy
                    })
                  }
                  setCatIndex(i)
                  setTimeout(() => setTransitioning(false), 150)
                }}
                role="menuitem"
                aria-selected={isActive}
                aria-label={cat.label}
                tabIndex={isActive ? 0 : -1}
              >
                <XMBIcon
                  name={cat.icon}
                  className="transition-all duration-300"
                  size={isActive ? catIconSize : catIconSizeInactive}
                  style={{
                    color: isActive ? "#e0e0e0" : "#666",
                    filter: isActive
                      ? "drop-shadow(0 0 8px rgba(100,160,255,0.4))"
                      : "none",
                  }}
                />
                <span
                  className="mt-1 sm:mt-2 text-[10px] sm:text-xs tracking-wider font-medium transition-all duration-300"
                  style={{
                    color: isActive ? "#e0e0e0" : "#555",
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(-4px)",
                  }}
                >
                  {cat.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Vertical items list - single list with items positioned above and below category bar */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: `translateX(${isMobile ? "-35px" : "-50px"})`,
            zIndex: 15,
          }}
          role="menu"
          aria-label={`${currentCat?.label} items`}
        >
          {currentCat?.items.map((item, i) => {
            const isActive = i === currentItemIndex
            const relativePosition = i - currentItemIndex
            const distance = Math.abs(relativePosition)
            
            // Calculate Y position: items above go negative (above category bar), items below go positive
            // Selected item (relativePosition === 0) is at itemTopOffset below center
            // Items above use itemAboveOffset as starting point
            // Items below: need extra offset to account for selected item's expanded height (subtitle + tags)
            let yOffset: number
            if (relativePosition < 0) {
              // Items above the selected one
              yOffset = itemAboveOffset + (relativePosition + 1) * itemSpacing
            } else if (relativePosition === 0) {
              // Selected item
              yOffset = itemTopOffset
            } else {
              // Items below - add extra offset to account for selected item's expanded content
              const extraOffset = isMobile ? 32 : 40
              yOffset = itemTopOffset + extraOffset + relativePosition * itemSpacing
            }
            
            // On mobile, show fewer items to reduce clutter
            const maxDistance = isMobile ? 2 : 4
            if (distance > maxDistance) return null
            
            return (
              <button
                key={item.id}
                className="absolute flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-2 sm:px-3 rounded-sm outline-none focus-visible:ring-1 text-left"
                style={{
                  opacity: isActive ? 1 : Math.max(0.1, 0.5 - distance * 0.1),
                  transform: `translateY(${yOffset}px) scale(${isActive ? 1 : Math.max(0.85, 0.95 - distance * 0.02)})`,
                  transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, background 0.25s ease",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(60,120,220,0.15) 0%, rgba(60,120,220,0) 100%)"
                    : "transparent",
                  maxWidth: isMobile ? "calc(100vw - 40px)" : "none",
                }}
                onClick={() => {
                  setItemIndices((prev) => {
                    const copy = [...prev]
                    copy[catIndex] = i
                    return copy
                  })
                  if (isActive) handleSelect()
                }}
                role="menuitem"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
              >
                {/* Thin selection indicator */}
                <div
                  className="w-0.5 h-6 sm:h-8 rounded-full shrink-0"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(100,160,255,0.8)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 0 8px rgba(100,160,255,0.4)"
                      : "none",
                    transition: "background-color 0.25s ease, box-shadow 0.25s ease",
                  }}
                />
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap"
                    style={{ 
                      color: isActive ? "#f0f0f0" : "#888",
                      transition: "color 0.25s ease",
                    }}
                  >
                    {item.label}
                  </span>
                  {(item.subtitle || currentCat.id === "settings") && (
                    <span
                      className="text-[10px] sm:text-xs whitespace-nowrap"
                      style={{
                        color: isActive ? "rgba(200,200,200,0.6)" : "rgba(150,150,150,0.4)",
                        maxHeight: isActive ? "20px" : "0px",
                        overflow: "hidden",
                        opacity: isActive ? 1 : 0,
                        transition: "all 0.25s ease",
                      }}
                    >
                      {getItemSubtitle(item, currentCat.id)}
                    </span>
                  )}
                </div>
                {/* Tags for active project items - hidden on mobile */}
                {isActive && item.tags && !isMobile && (
                  <div className="flex gap-1.5 ml-auto items-center flex-nowrap">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded-sm tracking-wide whitespace-nowrap"
                        style={{
                          backgroundColor: "rgba(60,120,220,0.15)",
                          color: "rgba(160,190,240,0.8)",
                          border: "1px solid rgba(60,120,220,0.2)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-sm tracking-wide whitespace-nowrap"
                        style={{
                          backgroundColor: "rgba(100,100,100,0.15)",
                          color: "rgba(180,180,180,0.7)",
                          border: "1px solid rgba(100,100,100,0.2)",
                        }}
                      >
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                {/* Show tag count badge on mobile */}
                {isActive && item.tags && isMobile && (
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-sm ml-auto shrink-0"
                    style={{
                      backgroundColor: "rgba(60,120,220,0.15)",
                      color: "rgba(160,190,240,0.8)",
                      border: "1px solid rgba(60,120,220,0.2)",
                    }}
                  >
                    {item.tags.length} tags
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom info bar */}
      <footer className="px-3 sm:px-6 py-2 sm:py-3 z-20">
        <div className="flex items-center justify-between">
          <div
            className="text-[9px] sm:text-[10px] tracking-widest uppercase font-mono"
            style={{ color: "rgba(150,150,150,0.4)" }}
          >
            {currentItem?.date || ""}
          </div>
          <div
            className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] tracking-wider font-mono"
            style={{ color: "rgba(150,150,150,0.4)" }}
          >
            <span className="hidden sm:inline">
              {"<"} {">"} Navigate
            </span>
            <span className="hidden sm:inline">Enter: Select</span>
            <span className="sm:hidden">Swipe or tap</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
