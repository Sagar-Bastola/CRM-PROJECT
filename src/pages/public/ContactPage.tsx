import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6 text-center">
        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Get in touch</span>
        <h1 className="text-4xl font-bold mt-2 mb-3">Request a demo or ask us anything</h1>
        <p className="text-gray-400">We typically respond within one business hour.</p>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact information</h2>
            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Phone', value: '(225) 555-0100' },
                { icon: Mail, label: 'Email', value: 'hello@heavytrack.com' },
                { icon: MapPin, label: 'Headquarters', value: 'Baton Rouge, Louisiana' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                    <p className="font-medium text-gray-800 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-amber-500" />
                <p className="font-semibold text-gray-800 text-sm">Office hours</p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Monday – Friday: 8am – 6pm CST</p>
                <p>Saturday: 9am – 1pm CST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message sent!</h3>
                <p className="text-gray-500 text-sm">We'll be in touch within one business hour.</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-gray-900 mb-5">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="First name" placeholder="Jake" required />
                    <Input label="Last name" placeholder="Broussard" required />
                  </div>
                  <Input label="Company / Dealership" placeholder="Gulf Coast Equipment Co." required />
                  <Input label="Email" type="email" placeholder="jake@gulfcoast.com" required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      placeholder="I'd like to see a demo for our 3-branch dealership..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full justify-center">Send message</Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage