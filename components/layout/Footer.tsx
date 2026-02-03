/**
 * Footer Component
 * Main site footer
 */

import React from 'react'
import Link from 'next/link'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">oResume</h3>
            <p className="text-primary-200 text-sm">
              Enterprise-grade job search and resume repository platform
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/upload" className="text-primary-200 hover:text-white transition-colors">
                  Upload Resume
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-primary-200 hover:text-white transition-colors">
                  Manage Profile
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-primary-200 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/employers/signup" className="text-primary-200 hover:text-white transition-colors">
                  Employer Signup
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-primary-200 hover:text-white transition-colors">
                  Search Candidates
                </Link>
              </li>
              <li>
                <Link href="/employers/pricing" className="text-primary-200 hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-primary-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-400 text-center text-sm text-primary-200">
          <p>&copy; {currentYear} oResume. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
