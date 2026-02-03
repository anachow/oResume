/**
 * Root Layout
 * Main application layout with providers
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'oResume - Enterprise Job Search & Resume Platform',
  description: 'Professional job search and resume repository platform for job seekers, employers, and recruiters',
  keywords: ['jobs', 'resume', 'hiring', 'recruitment', 'career'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
