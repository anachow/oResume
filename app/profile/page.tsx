import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-md text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">My Profile</h1>
        <div className="bg-white p-8 rounded-lg shadow-medium">
          <p className="text-text-light mb-6">Please sign in to view your profile.</p>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
