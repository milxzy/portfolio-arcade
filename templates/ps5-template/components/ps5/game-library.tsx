"use client";

import { useState, useEffect, useRef } from "react";
import {
    Search,
    Settings,
    ChevronLeft,
    Play,
    MoreHorizontal,
    Trophy,
    ArrowLeft,
} from "lucide-react";
import type { UserProfile, Project } from "@/lib/projects";
import { getProjectsForProfile } from "@/lib/projects";

interface Props {
    profile: UserProfile;
    onBack: () => void;
    onSelectProject: (project: Project) => void;
}

const names: Record<UserProfile, string> = {
    recruiter: "Recruiter",
    engineer: "Engineer",
    stranger: "Internet Stranger",
};

// the main game library view with the horizontal scroll of projects
export function GameLibrary({ profile, onBack, onSelectProject }: Props) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [idx, setIdx] = useState(0);
    const [tab, setTab] = useState<"games" | "media">("games");
    const [loaded, setLoaded] = useState(false);
    const scrollBox = useRef<HTMLDivElement>(null);

    // load projects for this profile type
    useEffect(() => {
        setProjects(getProjectsForProfile(profile));
        setLoaded(true);
    }, [profile]);

    // keyboard nav
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                setIdx((prev) => Math.max(0, prev - 1));
            } else if (e.key === "ArrowRight") {
                setIdx((prev) => Math.min(projects.length - 1, prev + 1));
            } else if (e.key === "Enter" || e.key === " ") {
                if (projects[idx]) {
                    onSelectProject(projects[idx]);
                }
            } else if (e.key === "Escape" || e.key === "Backspace") {
                onBack();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [idx, projects, onSelectProject, onBack]);

    // scroll selected tile into view
    useEffect(() => {
        if (scrollBox.current) {
            const el = scrollBox.current.children[idx + 1] as HTMLElement;
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                });
            }
        }
    }, [idx]);

    const current = projects[idx];
    const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    // loading state
    if (!loaded || !current) {
        return (
            <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* bg image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{ backgroundImage: `url(${current.backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* top nav */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-8">
                    {/* back btn */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-6 h-6 text-white/80" />
                    </button>

                    {/* tabs */}
                    <nav className="flex items-center gap-6">
                        <button
                            type="button"
                            onClick={() => setTab("games")}
                            className={`text-xl font-medium transition-colors ${
                                tab === "games"
                                    ? "text-white"
                                    : "text-white/50 hover:text-white/70"
                            }`}
                        >
                            Projects
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("media")}
                            className={`text-xl font-medium transition-colors ${
                                tab === "media"
                                    ? "text-white"
                                    : "text-white/50 hover:text-white/70"
                            }`}
                        >
                            Media
                        </button>
                    </nav>
                </div>

                {/* right side stuff */}
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        className="text-white/60 hover:text-white transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                    <button
                        type="button"
                        className="text-white/60 hover:text-white transition-colors"
                        aria-label="Settings"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                            {names[profile][0]}
                        </span>
                    </div>
                    <span className="text-white/80 text-lg">{time}</span>
                </div>
            </header>

            {/* project tiles row */}
            <div className="relative z-10 mt-4 px-8">
                <div
                    ref={scrollBox}
                    className="flex items-start gap-4 overflow-x-auto pt-4 pb-10 scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {/* back tile */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-shrink-0 w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                        aria-label="Go back to user selection"
                    >
                        <ArrowLeft className="w-6 h-6 text-white/60" />
                    </button>

                    {projects.map((proj, i) => (
                        <button
                            type="button"
                            key={proj.id}
                            onClick={() => {
                                setIdx(i);
                                onSelectProject(proj);
                            }}
                            onMouseEnter={() => setIdx(i)}
                            className={`flex-shrink-0 relative group transition-all duration-300 ${
                                i === idx
                                    ? "scale-110 z-10"
                                    : "scale-100 opacity-80"
                            }`}
                        >
                            <div
                                className={`w-28 h-28 rounded-xl overflow-hidden transition-all duration-300 ${
                                    i === idx
                                        ? "ring-4 ring-white shadow-lg shadow-white/20"
                                        : "ring-2 ring-white/20"
                                }`}
                            >
                                <img
                                    src={proj.coverImage || "/placeholder.svg"}
                                    alt={proj.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {i === idx && (
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="text-white text-sm font-medium">
                                        {proj.title}
                                    </span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* selected project details */}
            <div className="relative z-10 mt-16 px-8 flex gap-8">
                {/* left - info */}
                <div className="flex-1 max-w-2xl">
                    {/* title */}
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                        {current.title}
                    </h1>
                    <p className="text-xl text-white/80 mb-6">
                        {current.subtitle}
                    </p>

                    {/* desc */}
                    <p className="text-white/60 text-lg mb-8 max-w-xl leading-relaxed">
                        {current.description}
                    </p>

                    {/* btns */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => onSelectProject(current)}
                            className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 group"
                        >
                            <Play className="w-5 h-5 text-white fill-white" />
                            <span className="text-white font-medium text-lg">
                                View
                            </span>
                        </button>
                        <button
                            type="button"
                            className="p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                            aria-label="More options"
                        >
                            <MoreHorizontal className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* right - card and stats */}
                <div className="hidden lg:flex flex-col gap-4 w-80">
                    {/* project card */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <img
                            src={current.coverImage || "/placeholder.svg"}
                            alt={current.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full mb-2">
                                Project
                            </span>
                            <p className="text-white/60 text-sm">
                                View Details
                            </p>
                        </div>
                    </div>

                    {/* progress */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
                        <Trophy className="w-10 h-10 text-amber-400" />
                        <div className="flex-1">
                            <div className="flex justify-between text-white/60 text-sm mb-1">
                                <span>Progress</span>
                                <span>Tech Stack</span>
                            </div>
                            <div className="flex justify-between text-white font-medium">
                                <span>{current.progress}%</span>
                                <span>
                                    {current.achievements}/
                                    {current.totalAchievements}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* tech badges */}
                    <div className="flex flex-wrap gap-2">
                        {current.techStack.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                        {current.techStack.length > 4 && (
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/60 text-sm">
                                +{current.techStack.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* bottom hints */}
            <div className="absolute bottom-8 left-8 flex items-center gap-4 text-white/40 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">
                        O
                    </div>
                    <span>Back</span>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 flex items-center gap-4 text-white/40 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-xs">
                        X
                    </div>
                    <span>Select</span>
                </div>
            </div>
        </div>
    );
}
