import React from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

const plans = [
  {
    name: 'Starter', price: '$29', per: '/user/month', desc: 'Small dealerships, 1–2 branches',
    features: ['Companies & contacts', 'Equipment fleet tracking', 'Leads & opportunities', 'Tasks & notes', '1 branch', 'Email support'],
    cta: 'Get Started', featured: false,
  },
  {
    name: 'Professional', price: '$35', per: '/user/month', desc: 'Growing dealerships, multi-branch',
    features: ['Everything in Starter', 'Unlimited branches', 'Admin cross-branch view', 'Advanced reporting', 'Priority support', 'Data import'],
    cta: 'Request Demo', featured: true,
  },
  {
    name: 'Enterprise', price: '$25', per: '/user/month', desc: 'Large dealer groups, 100+ users',
    features: ['Everything in Professional', 'Dedicated account manager', 'Custom onboarding', 'Data migration support', 'SLA guarantee', 'API access'],
    cta: 'Contact Sales', featured: false,
  },
]

const PricingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6 text-center">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Simple pricing</span>
        <h1 className="text-4xl font-bold mt-2 mb-3">No hidden fees. No long-term contracts.</h1>
        <p className="text-gray-400">Month-to-month pricing that scales with your dealership.</p>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl p-6 border-2 transition-shadow ${
                plan.featured ? 'border-amber-400 shadow-xl shadow-amber-100' : 'border-gray-100 hover:shadow-md'
              }`}
            >
              {plan.featured && (
                <div className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.per}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={15} className="text-amber-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full justify-center"
                variant={plan.featured ? 'primary' : 'outline'}
                onClick={() => navigate('/contact')}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          + $450/month server & backup support fee · All plans include a 14-day free trial
        </p>
      </section>
    </div>
  )
}

export default PricingPage