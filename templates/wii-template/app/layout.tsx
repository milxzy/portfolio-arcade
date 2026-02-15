import React from "react"
import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'

import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Wii Portfolio | Developer Channel Menu',
  description: 'A creative developer portfolio styled like the Nintendo Wii Channel Menu',
}

export const viewport: Viewport = {
  themeColor: '#D8DDE3',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
