"use client"

import React from "react"

import { useState } from "react"
import { Send, Download, Github, Linkedin, Twitter, CheckCircle } from "lucide-react"

export function ContactView() {
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Message form */}
      <div className="wii-slide-up">
        <h3 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-3">
          New Message
        </h3>
        {sent ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/60 p-8">
            <CheckCircle size={40} className="text-[#2ECC71]" />
            <p className="text-sm font-bold text-[#2A3A4A]">Message sent!</p>
            <p className="text-xs text-[#7A8A9A]">{"You've got a new memo in your inbox"}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-lg sm:rounded-xl bg-white/70 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[#2A3A4A] placeholder:text-[#AAB8C8] outline-none focus:ring-2 focus:ring-[#3B9BD9]/30 transition-all"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-lg sm:rounded-xl bg-white/70 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[#2A3A4A] placeholder:text-[#AAB8C8] outline-none focus:ring-2 focus:ring-[#3B9BD9]/30 transition-all"
                required
              />
            </div>
            <textarea
              placeholder="Write your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full rounded-lg sm:rounded-xl bg-white/70 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[#2A3A4A] placeholder:text-[#AAB8C8] outline-none focus:ring-2 focus:ring-[#3B9BD9]/30 resize-none transition-all"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-[#3B9BD9] px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#2E8BC0] active:scale-[0.98] transition-all"
            >
              <Send size={14} />
              Send Message
            </button>
          </form>
        )}
      </div>

      {/* Attachments - Social links */}
      <div className="wii-slide-up" style={{ animationDelay: "100ms" }}>
        <h3 className="text-sm font-bold text-[#3B9BD9] uppercase tracking-wide mb-3">
          Attachments
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Github, label: "GitHub", href: "#" },
            { icon: Linkedin, label: "LinkedIn", href: "#" },
            { icon: Twitter, label: "Twitter", href: "#" },
            { icon: Download, label: "Resume", href: "#" },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 p-4 hover:bg-white/80 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <Icon size={24} className="text-[#4A5A6A]" />
              <span className="text-xs font-bold text-[#4A5A6A]">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
