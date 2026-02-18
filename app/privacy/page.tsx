export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-lg shadow-medium p-8 space-y-6 text-text">
          <p className="text-sm text-text-light">Last updated: February 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly, including name, email, mobile number, resume, employment history, and skills. We also collect usage data to improve our platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To create and manage your account</li>
              <li>To connect you with relevant employers and recruiters</li>
              <li>To send job alerts and platform updates (with your consent)</li>
              <li>To improve our matching algorithms</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">3. Data Sharing</h2>
            <p>We share your profile with employers and recruiters based on your visibility settings. We never sell your personal data to third parties. We may share data with service providers who assist our operations under strict confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">4. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. You can update your visibility settings or request account deletion at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">5. Security</h2>
            <p>We use industry-standard encryption and security practices including row-level security, secure file storage, and audit logging to protect your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mb-3">6. Contact</h2>
            <p>For privacy-related queries, contact us at <a href="mailto:privacy@ostaran.com" className="text-primary hover:underline">privacy@ostaran.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
