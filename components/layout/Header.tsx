/**
 * Header Component
 * Main navigation header
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Menu, X, User } from 'lucide-react'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">oResume</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className="text-text hover:text-primary transition-colors"
            >
              Search Candidates
            </Link>
            <Link
              href="/employers"
              className="text-text hover:text-primary transition-colors"
            >
              For Employers
            </Link>
            <Link
              href="/recruiters"
              className="text-text hover:text-primary transition-colors"
            >
              For Recruiters
            </Link>
            <Link
              href="/about"
              className="text-text hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="accent" size="sm">
                Upload Resume
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-text" />
            ) : (
              <Menu className="w-6 h-6 text-text" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                href="/search"
                className="text-text hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search Candidates
              </Link>
              <Link
                href="/employers"
                className="text-text hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Employers
              </Link>
              <Link
                href="/recruiters"
                className="text-text hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Recruiters
              </Link>
              <Link
                href="/about"
                className="text-text hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link href="/signin">
                  <Button variant="ghost" size="sm" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="accent" size="sm" fullWidth>
                    Upload Resume
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
