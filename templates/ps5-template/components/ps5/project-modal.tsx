"use client";

import { useEffect, useMemo } from "react";
import {
    X,
    ExternalLink,
    Github,
    Trophy,
    Play,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { Project } from "@/lib/projects";

interface Props {
    project: Project;
    onClose: () => void;
}

// Normalize markdown content - handles Windows line endings
function normalizeMarkdown(content: string | undefined): string {
    if (!content) return "";
    // Normalize Windows line endings to Unix style
    return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

// the modal that shows full project details
export function ProjectModal({ project, onClose }: Props) {
    // Normalize the markdown content
    const normalizedDescription = useMemo(
        () => normalizeMarkdown(project.fullDescription),
        [project.fullDescription]
    );
    
    // esc to close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            // check if user is typing in an input field
            const activeElement = document.activeElement;
            const isInInput = activeElement instanceof HTMLInputElement || 
                             activeElement instanceof HTMLTextAreaElement ||
                             activeElement?.tagName === 'INPUT' ||
                             activeElement?.tagName === 'TEXTAREA';
            
            if (e.key === "Escape" || (e.key === "Backspace" && !isInInput)) {
                onClose();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
                onKeyDown={(e) => e.key === "Enter" && onClose()}
                role="button"
                tabIndex={0}
                aria-label="Close modal"
            />

            {/* modal box */}
            <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2030] to-[#0a0f14] animate-in zoom-in-95 duration-300 mx-4">
                {/* bg image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage: `url(${project.backgroundImage})`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14] via-[#0a0f14]/80 to-transparent" />

                {/* close btn */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-2 right-4 z-20 cursor-pointer p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* content */}
                <div className="relative z-10 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* left side */}
                        <div className="flex-1">
                            {/* header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-4 py-1 bg-primary/20 text-primary text-sm rounded-full font-medium">
                                        Project
                                    </span>
                                    <span className="text-white/40 text-sm">
                                        Full Details
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    {project.title}
                                </h1>
                                <p className="text-xl text-white/60">
                                    {project.subtitle}
                                </p>
                            </div>

                            {/* hero img */}
                            <div className="relative rounded-2xl overflow-hidden mb-8 group">
                                <img
                                    src={
                                        project.backgroundImage ||
                                        "/placeholder.svg"
                                    }
                                    alt={project.title}
                                    className="w-full h-64 md:h-80 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        className="p-4 bg-white/20 backdrop-blur-sm rounded-full"
                                        aria-label="Play demo"
                                    >
                                        <Play className="w-8 h-8 text-white fill-white" />
                                    </button>
                                </div>
                                {/* nav arrows */}
                                <button
                                    type="button"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* about */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    About This Project
                                </h2>
                                <div className="text-white/70 leading-relaxed text-lg prose prose-invert prose-lg max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                        components={{
                                            h1: ({ node, ...props }) => (
                                                <h1 className="text-2xl font-bold mb-4 mt-6 pb-2 border-b border-white/20 text-white" {...props} />
                                            ),
                                            h2: ({ node, ...props }) => (
                                                <h2 className="text-xl font-semibold mb-3 mt-5 pb-2 border-b border-white/10 text-white/90" {...props} />
                                            ),
                                            h3: ({ node, ...props }) => (
                                                <h3 className="text-lg font-medium mb-2 mt-4 text-white/85" {...props} />
                                            ),
                                            h4: ({ node, ...props }) => (
                                                <h4 className="text-base font-medium mb-2 mt-3 text-white/80" {...props} />
                                            ),
                                            p: ({ node, ...props }) => (
                                                <p className="mb-4 text-white/70 leading-7" {...props} />
                                            ),
                                            ul: ({ node, ...props }) => (
                                                <ul className="list-disc pl-6 mb-4 space-y-1 text-white/70" {...props} />
                                            ),
                                            ol: ({ node, ...props }) => (
                                                <ol className="list-decimal pl-6 mb-4 space-y-1 text-white/70" {...props} />
                                            ),
                                            li: ({ node, children, ...props }) => (
                                                <li className="text-white/70 pl-1" {...props}>{children}</li>
                                            ),
                                            code: ({ node, className, children, ...props }) => {
                                                const isInline = !className?.includes("language-");
                                                return isInline ? (
                                                    <code
                                                        className="px-1.5 py-0.5 rounded text-sm font-mono bg-white/10 text-primary"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                ) : (
                                                    <code
                                                        className="block px-4 py-3 rounded-lg text-sm font-mono bg-black/30 text-white/80 overflow-x-auto"
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            pre: ({ node, ...props }) => (
                                                <pre
                                                    className="mb-4 p-4 rounded-lg overflow-x-auto bg-black/40 border border-white/10"
                                                    {...props}
                                                />
                                            ),
                                            a: ({ node, ...props }) => (
                                                <a
                                                    className="text-primary hover:text-primary/80 underline"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    {...props}
                                                />
                                            ),
                                            blockquote: ({ node, ...props }) => (
                                                <blockquote
                                                    className="border-l-4 border-primary/50 pl-4 my-4 text-white/60"
                                                    {...props}
                                                />
                                            ),
                                            strong: ({ node, ...props }) => (
                                                <strong className="font-semibold text-white/90" {...props} />
                                            ),
                                            em: ({ node, ...props }) => (
                                                <em className="italic text-white/75" {...props} />
                                            ),
                                            hr: ({ node, ...props }) => (
                                                <hr className="my-6 border-white/20" {...props} />
                                            ),
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto mb-4">
                                                    <table className="min-w-full border-collapse border border-white/20 rounded-lg" {...props} />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => (
                                                <thead className="bg-white/5" {...props} />
                                            ),
                                            th: ({ node, ...props }) => (
                                                <th className="border border-white/20 px-4 py-2 text-left font-semibold text-white/90" {...props} />
                                            ),
                                            td: ({ node, ...props }) => (
                                                <td className="border border-white/20 px-4 py-2 text-white/70" {...props} />
                                            ),
                                            del: ({ node, ...props }) => (
                                                <del className="text-white/50 line-through" {...props} />
                                            ),
                                            input: ({ node, ...props }) => (
                                                <input
                                                    className="mr-2 accent-primary"
                                                    disabled
                                                    {...props}
                                                />
                                            ),
                                            img: ({ node, ...props }) => (
                                                <img
                                                    className="max-w-full h-auto rounded-lg my-4"
                                                    {...props}
                                                />
                                            ),
                                        }}
                                    >
                                        {normalizedDescription}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* action btns */}
                            <div className="flex flex-wrap gap-4">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary/90 rounded-full text-white font-medium transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        View Live
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors"
                                    >
                                        <Github className="w-5 h-5" />
                                        View Source
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* right side - stats */}
                        <div className="lg:w-80 space-y-6">
                            {/* progress card */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <Trophy className="w-12 h-12 text-amber-400" />
                                    <div>
                                        <p className="text-white/60 text-sm">
                                            Achievements
                                        </p>
                                        <p className="text-2xl font-bold text-white">
                                            {project.achievements}/
                                            {project.totalAchievements}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">
                                            Progress
                                        </span>
                                        <span className="text-white">
                                            {project.progress}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${project.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* tech stack */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary rounded-full" />
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 bg-white/10 rounded-xl text-white/80 text-sm font-medium hover:bg-white/20 transition-colors"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* quick stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center">
                                    <p className="text-3xl font-bold text-white mb-1">
                                        {project.techStack.length}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Technologies
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center">
                                    <p className="text-3xl font-bold text-white mb-1">
                                        {project.achievements}
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Features
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* bottom hint */}
                <div className="absolute bottom-6 left-6 flex items-center gap-4 text-white/40 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center text-xs">
                            O
                        </div>
                        <span>Close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
