import React from 'react'
import { Truck } from 'lucide-react'

const team = [
  { name: 'Jake Broussard', role: 'CEO & Co-founder', initials: 'JB', color: 'bg-amber-500' },
  { name: 'Lisa Martin', role: 'CTO & Co-founder', initials: 'LM', color: 'bg-blue-500' },
  { name: 'Mike Tran', role: 'Head of Sales', initials: 'MT', color: 'bg-green-500' },
  { name: 'Sara Wells', role: 'Head of Support', initials: 'SW', color: 'bg-purple-500' },
  { name: 'Tom Roy', role: 'Lead Engineer', initials: 'TR', color: 'bg-red-500' },
  { name: 'Chris Beau', role: 'Product Design', initials: 'CB', color: 'bg-teal-500' },
]

const stats = [
  { value: '500+', label: 'Active Dealerships' },
  { value: '12K+', label: 'Machines Tracked' },
  { value: '2019', label: 'Founded' },
  { value: '4.9★', label: 'Customer Rating' },
]

const AboutPage: React.FC = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6 text-center">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Our story</span>
        <h1 className="text-4xl font-bold mt-2 mb-3">Built by people who know heavy equipment</h1>
        <p className="text-gray-400 max-w-xl mx-auto">We started HeavyTrack because generic CRMs don't understand dozers, serial numbers, or dealer branches.</p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              HeavyTrack was founded by a team with deep roots in the heavy equipment industry. We saw dealerships struggling with generic CRM tools built for software sales teams — not people tracking Komatsu excavators in the field.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We built HeavyTrack specifically for heavy equipment dealers — with fleet tracking, branch management, and a lead pipeline that matches how equipment sales actually work.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today we serve over 500 dealerships across the US, tracking more than 12,000 machines.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className="bg-amber-50 rounded-2xl p-5 text-center">
                <p className="text-3xl font-bold text-amber-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {team.map(m => (
              <div key={m.name} className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${m.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3`}>
                  {m.initials}
                </div>
                <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage