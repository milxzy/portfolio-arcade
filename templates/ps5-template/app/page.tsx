"use client"

import { useState, useEffect } from "react"
import { UserSelection } from "@/components/ps5/user-selection"
import { GameLibrary } from "@/components/ps5/game-library"
import { ProjectModal } from "@/components/ps5/project-modal"
import { loadPortfolioData } from "@/lib/load-portfolio-data"
import type { UserProfile, Project } from "@/lib/projects"

// main page component, handles which screen we're showing
export default function Page() {
  const [screen, setScreen] = useState<"selection" | "library">("selection")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [userName, setUserName] = useState<string>("Developer")

  useEffect(() => {
    loadPortfolioData().then((data) => {
      if (data.user.name) setUserName(data.user.name)
    })
  }, [])

  const pickProfile = (p: UserProfile) => {
    setProfile(p)
    setScreen("library")
  }

  const goBack = () => {
    setScreen("selection")
    setProfile(null)
  }

  const openProject = (p: Project) => setProject(p)
  const closeProject = () => setProject(null)

  return (
    <main className="min-h-screen bg-background">
      {screen === "selection" && (
        <UserSelection onSelectProfile={pickProfile} userName={userName} />
      )}

      {screen === "library" && profile && (
        <GameLibrary
          profile={profile}
          onBack={goBack}
          onSelectProject={openProject}
        />
      )}

      {project && (
        <ProjectModal project={project} onClose={closeProject} />
      )}
    </main>
  )
}
