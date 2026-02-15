"use client"

import { channels } from "@/lib/channels"
import { Home } from "lucide-react"
import { ProjectsView } from "./channel-views/projects-view"
import { TechStackView } from "./channel-views/tech-stack-view"
import { AboutView } from "./channel-views/about-view"
import { ContactView } from "./channel-views/contact-view"
import { SettingsView } from "./channel-views/settings-view"
import { ChannelIcon } from "./channel-icon"

function getChannelContent(
  channelId: string,
  soundEnabled: boolean,
  onToggleSound: () => void
) {
  switch (channelId) {
    case "recruiter":
      return {
        title: "Recruiter View",
        description: "Welcome! Here are projects that showcase production-ready work.",
        content: <ProjectsView filter="recruiter" />,
      }
    case "engineer":
      return {
        title: "Engineer View",
        description: "Technical deep-dives and complex architectures.",
        content: <ProjectsView filter="engineer" />,
      }
    case "creative":
      return {
        title: "Creative Lab",
        description: "Experimental and artistic projects.",
        content: <ProjectsView filter="creative" />,
      }
    case "all-projects":
      return {
        title: "All Projects",
        description: "Everything in one place.",
        content: <ProjectsView />,
      }
    case "web-apps":
      return {
        title: "Web Apps Channel",
        description: "Production web applications.",
        content: <ProjectsView filter="web-apps" />,
      }
    case "open-source":
      return {
        title: "Open Source Channel",
        description: "Contributions to the community.",
        content: <ProjectsView filter="open-source" />,
      }
    case "creative-lab":
      return {
        title: "Creative Lab",
        description: "Fun, experimental work.",
        content: <ProjectsView filter="creative-lab" />,
      }
    case "archive":
      return {
        title: "Archive Channel",
        description: "Older projects and learning experiments.",
        content: <ProjectsView filter="archive" />,
      }
    case "tech-stack":
      return {
        title: "Tech Stack",
        description: "Skills and proficiencies.",
        content: <TechStackView />,
      }
    case "about-me":
      return {
        title: "About Me",
        description: "The developer behind the code.",
        content: <AboutView />,
      }
    case "contact":
      return {
        title: "Contact",
        description: "Get in touch.",
        content: <ContactView />,
      }
    case "settings":
      return {
        title: "Settings",
        description: "Preferences and info.",
        content: (
          <SettingsView
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
          />
        ),
      }
    default:
      return {
        title: "Channel",
        description: "",
        content: <div className="text-[#7A8A9A]">Coming soon...</div>,
      }
  }
}

export function ChannelDetail({
  channelId,
  onBack,
  soundEnabled,
  onToggleSound,
}: {
  channelId: string
  onBack: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}) {
  const channel = channels.find((c) => c.id === channelId)
  const { title, description, content } = getChannelContent(
    channelId,
    soundEnabled,
    onToggleSound
  )

  return (
    <div className="fixed inset-0 z-30 flex flex-col">
      {/* Wii blue gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #5AADE0 0%, #3B9BD9 30%, #2B7CB8 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 md:px-8 py-3 sm:py-4 border-b border-white/15">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {channel && (
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm shrink-0"
                style={{ background: channel.color, color: channel.textColor }}
              >
                <ChannelIcon icon={channel.icon} size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white truncate">{title}</h1>
              <p className="text-[10px] sm:text-xs text-white/60 truncate">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white hover:bg-white/25 active:scale-[0.97] transition-all shrink-0"
          >
            <Home size={14} className="sm:w-[15px] sm:h-[15px]" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 md:px-8 py-4 sm:py-6">
          <div className="max-w-5xl mx-auto">{content}</div>
        </div>
      </div>
    </div>
  )
}
