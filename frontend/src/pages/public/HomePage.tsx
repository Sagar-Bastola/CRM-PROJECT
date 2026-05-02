import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck, BarChart3, Users, CheckSquare, MapPin, Shield, ArrowRight, Star } from 'lucide-react'
import Button from '../../components/ui/Button'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    { icon: Truck, title: 'Fleet Tracking', desc: 'Track every machine your customers own — model, serial number, last service date and GPS location.' },
    { icon: Users, title: 'Lead Pipeline', desc: 'Capture every inquiry, track it through your pipeline and never let a deal slip through.' },
    { icon: BarChart3, title: 'Opportunity Kanban', desc: 'Visual Kanban board across Discovery, Proposal, Negotiation and Closed stages.' },
    { icon: CheckSquare, title: 'Task Management', desc: 'Assign tasks to your sales team, set due dates and track follow-ups.' },
    { icon: MapPin, title: 'Multi-Branch', desc: 'Manage multiple dealership locations. Sales reps see only their branch data.' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Admin and user roles. Full audit trail on every record.' },
  ]

  const stats = [
    { value: '500+', label: 'Active Dealers' },
    { value: '12,000+', label: 'Machines Tracked' },
    { value: '$340M+', label: 'Deals Closed' },
    { value: '4.9★', label: 'Customer Rating' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Built for heavy equipment dealers
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            The CRM built for{' '}
            <span className="text-amber-400">dozers, excavators</span>
            {' '}and the teams that sell them
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Track your customer fleet, manage leads, close more equipment deals — all in one platform built specifically for heavy equipment dealerships.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/contact')} className="gap-2">
              Request a Free Demo <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/features')}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent">
              See All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-500 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-amber-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Everything you need</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">One platform for your entire dealership</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From the first lead to the final delivery — HeavyTrack keeps every deal and every machine organized.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-amber-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-amber-400 fill-amber-400" />)}
          </div>
          <blockquote className="text-xl font-medium text-gray-800 italic mb-4">
            "HeavyTrack transformed how we track customer equipment and close deals. Our team went from spreadsheets to a real CRM in one day."
          </blockquote>
          <p className="text-sm text-gray-500">— Jake Broussard, Gulf Coast Equipment Co.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gray-900 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Ready to see it in action?</h2>
        <p className="text-gray-400 mb-6">Join 500+ heavy equipment dealers already using HeavyTrack CRM.</p>
        <Button size="lg" onClick={() => navigate('/contact')}>Request a Free Demo</Button>
      </section>
    </div>
  )
}

export default HomePage