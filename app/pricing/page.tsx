import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'For job seekers getting started',
    features: ['Upload 1 resume', 'Basic profile', 'Apply to jobs', 'Email alerts'],
    cta: 'Get Started',
    href: '/upload',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '₹999',
    period: 'per month',
    description: 'For active job seekers and small employers',
    features: ['Unlimited resumes', 'Priority visibility', '50 candidate views/mo', 'Advanced search filters', 'Analytics dashboard'],
    cta: 'Start Free Trial',
    href: '/upload',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large employers and staffing agencies',
    features: ['Unlimited everything', 'Team management', 'AI matching', 'API access', 'Dedicated support', 'Custom integrations'],
    cta: 'Contact Sales',
    href: '/contact',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-text-light">Choose the plan that works for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg p-8 shadow-medium flex flex-col ${plan.highlight ? 'ring-2 ring-accent' : ''}`}
            >
              {plan.highlight && (
                <span className="inline-block bg-accent text-white text-sm font-medium px-3 py-1 rounded-full mb-4 self-start">
                  Most Popular
                </span>
              )}
              <h2 className="text-2xl font-bold text-primary mb-1">{plan.name}</h2>
              <div className="mb-2">
                <span className="text-4xl font-bold text-text">{plan.price}</span>
                <span className="text-text-light ml-1">/{plan.period}</span>
              </div>
              <p className="text-text-light mb-6">{plan.description}</p>
              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-text">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.highlight
                    ? 'bg-accent text-white hover:bg-accent-600'
                    : 'bg-primary text-white hover:bg-primary-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
