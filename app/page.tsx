/**
 * Homepage
 * Main landing page for oResume
 */

import Link from 'next/link'
import { Button } from '@/components/ui'
import { Upload, Search, Users, TrendingUp, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Job or Perfect Candidate
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Enterprise-grade platform connecting job seekers with employers and recruiters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button variant="accent" size="lg" leftIcon={<Upload />}>
                  Upload Resume
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<Search />}
                >
                  Search Candidates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Why Choose oResume?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Enterprise Security</h3>
              <p className="text-text-light">
                Bank-level security with role-based access control and data encryption
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">AI-Powered Matching</h3>
              <p className="text-text-light">
                Advanced AI algorithms to match candidates with perfect job opportunities
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">Large Network</h3>
              <p className="text-text-light">
                Connect with thousands of verified employers and top talent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="py-20 bg-primary-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-primary">For Job Seekers</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>Upload your resume and get discovered by top employers</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>AI-powered job matching based on your skills and experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>Privacy controls to manage your profile visibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>Track who viewed your profile and resume</span>
                </li>
              </ul>
              <Link href="/upload">
                <Button variant="accent" size="lg" className="mt-8">
                  Get Started Free
                </Button>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-medium">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                <Upload className="w-24 h-24 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white p-8 rounded-lg shadow-medium">
                <div className="aspect-video bg-gradient-to-br from-secondary-100 to-accent-100 rounded-lg flex items-center justify-center">
                  <Search className="w-24 h-24 text-secondary" />
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6 text-primary">For Employers</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>Search from thousands of verified candidate profiles</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>Advanced filters for precise candidate matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>Team collaboration with role-based access</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-accent mt-1" />
                  <span>Analytics and insights on hiring metrics</span>
                </li>
              </ul>
              <Link href="/employers/signup">
                <Button variant="primary" size="lg" className="mt-8">
                  Start Hiring Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-20">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers on oResume today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button variant="secondary" size="lg">
                Upload Resume
              </Button>
            </Link>
            <Link href="/employers/signup">
              <Button variant="primary" size="lg">
                Employer Signup
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
