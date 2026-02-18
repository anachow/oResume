export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-6">About oResume</h1>
        <div className="bg-white rounded-lg shadow-medium p-8 space-y-6 text-text">
          <p className="text-lg">
            oResume is an enterprise-grade job search and resume repository platform connecting
            job seekers with employers and recruiters across industries.
          </p>
          <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
          <p>
            To simplify hiring by providing a secure, AI-powered platform where talent meets opportunity.
            We serve final-year students, experienced professionals, employers, and staffing consultants.
          </p>
          <h2 className="text-2xl font-semibold text-primary">Why oResume?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Enterprise-grade security with end-to-end data protection</li>
            <li>AI-powered candidate matching and job recommendations</li>
            <li>Transparent privacy controls for job seekers</li>
            <li>Verified employer and recruiter profiles</li>
            <li>Real-time analytics for hiring teams</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
