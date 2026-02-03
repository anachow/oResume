/**
 * Recruiter Signup Page
 * Placeholder - To be implemented
 */

import Link from 'next/link'
import { Button } from '@/components/ui'

export default function RecruiterSignupPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Recruiter Enrollment
          </h1>
          <p className="text-lg text-text-light">
            Coming soon! Join our network of professional recruiters.
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
