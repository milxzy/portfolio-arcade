"use client"

import { channels } from "@/lib/channels"
import { ChannelTile } from "./channel-tile"

export function ChannelGrid({
  onOpenChannel,
  onHover,
  onClick,
}: {
  onOpenChannel: (id: string) => void
  onHover?: () => void
  onClick?: () => void
}) {
  const rows = [
    channels.filter((c) => c.row === 0),
    channels.filter((c) => c.row === 1),
    channels.filter((c) => c.row === 2),
  ]

  return (
    <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-8">
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3"
        >
          {row.map((channel, colIdx) => (
            <ChannelTile
              key={channel.id}
              channel={channel}
              onClick={onOpenChannel}
              onHover={onHover}
              onClickSound={onClick}
              index={rowIdx * 4 + colIdx}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
