import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'MilxOS | Developer Portfolio',
  description: 'a ps5-inspired developer portfolio showcasing projects and skills',
}

export const viewport: Viewport = {
  themeColor: '#0a0f14',
}

// wraps the whole app
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased overflow-hidden`}>{children}</body>
    </html>
  )
}
