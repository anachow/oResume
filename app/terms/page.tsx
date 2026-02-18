export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-6">Terms & Conditions</h1>
        <div className="bg-white rounded-lg shadow-medium p-8 space-y-6 text-text">
          <p className="text-sm text-text-light">Last updated: February 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using oResume, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">3. Acceptable Use</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Use the platform only for lawful employment-related purposes</li>
              <li>Do not post false, misleading, or fraudulent information</li>
              <li>Do not scrape, harvest, or abuse the platform</li>
              <li>Do not contact candidates outside of the platform in an unsolicited manner</li>
              <li>Employers must represent legitimate organizations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">4. Resume & Data</h2>
            <p>By uploading your resume, you grant oResume a non-exclusive license to display your profile to employers based on your visibility settings. You retain ownership of your data and can delete it at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">5. Subscriptions & Payments</h2>
            <p>Paid subscriptions are billed in advance. Refunds are available within 7 days of purchase if the service was not used. We reserve the right to modify pricing with 30 days notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">6. Limitation of Liability</h2>
            <p>oResume is not responsible for hiring decisions made by employers or for the accuracy of candidate information. We provide a platform for connection but do not guarantee employment outcomes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">7. Contact</h2>
            <p>For terms-related queries, contact us at <a href="mailto:legal@ostaran.com" className="text-primary hover:underline">legal@ostaran.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
