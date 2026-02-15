"use client"

import type { Channel } from "@/lib/channels"
import { ChannelIcon } from "./channel-icon"

export function ChannelTile({
  channel,
  onClick,
  onHover,
  onClickSound,
  index,
}: {
  channel: Channel
  onClick: (id: string) => void
  onHover?: () => void
  onClickSound?: () => void
  index: number
}) {
  const handleClick = () => {
    onClickSound?.()
    onClick(channel.id)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={onHover}
      className="wii-channel relative flex flex-col items-center justify-center rounded-lg p-2 sm:p-3 md:p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5AADE0]/60 focus-visible:ring-offset-2 w-full"
      style={{
        background: channel.color,
        color: channel.textColor,
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.05)",
        aspectRatio: "16 / 11",
        animationDelay: `${index * 80}ms`,
      }}
      aria-label={`Open ${channel.title} ${channel.subtitle || ""} channel`}
    >
      {/* Glossy top highlight */}
      <div
        className="absolute inset-x-0 top-0 h-[45%] rounded-t-lg pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.08) 60%, transparent 100%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-0.5 sm:gap-1">
        <ChannelIcon icon={channel.icon} size={20} className="sm:w-6 sm:h-6" />
        <div className="text-center">
          <div className="text-[11px] sm:text-xs md:text-sm font-bold leading-tight">
            {channel.title}
          </div>
          {channel.subtitle && (
            <div className="text-[9px] sm:text-[10px] md:text-xs font-semibold opacity-75 leading-tight">
              {channel.subtitle}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
