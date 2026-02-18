export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-6">Contact Us</h1>
        <div className="bg-white rounded-lg shadow-medium p-8 space-y-6">
          <p className="text-text-light">
            Have a question or need help? Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-primary mb-1">General Enquiries</h2>
              <a href="mailto:hello@ostaran.com" className="text-secondary hover:underline">hello@ostaran.com</a>
            </div>
            <div>
              <h2 className="font-semibold text-primary mb-1">Employer Support</h2>
              <a href="mailto:employers@ostaran.com" className="text-secondary hover:underline">employers@ostaran.com</a>
            </div>
            <div>
              <h2 className="font-semibold text-primary mb-1">Privacy & Data</h2>
              <a href="mailto:privacy@ostaran.com" className="text-secondary hover:underline">privacy@ostaran.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
