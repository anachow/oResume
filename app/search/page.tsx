/**
 * Search Page
 * Candidate search - Placeholder
 */

import Link from 'next/link'
import { Button } from '@/components/ui'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Search Candidates
          </h1>
          <p className="text-lg text-text-light">
            Coming soon! Advanced candidate search with AI-powered matching.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-medium text-center">
          <p className="text-text mb-6">
            This feature is under development. Please check back soon or contact us for early access.
          </p>
          <Link href="/">
            <Button variant="primary">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
