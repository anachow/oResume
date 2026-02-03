/**
 * Sign In Page
 * Placeholder - To be implemented
 */

import Link from 'next/link'
import { Button } from '@/components/ui'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Sign In
          </h1>
          <p className="text-lg text-text-light">
            Authentication coming soon!
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-medium text-center">
          <p className="text-text mb-6">
            This feature is under development. Please check back soon.
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
