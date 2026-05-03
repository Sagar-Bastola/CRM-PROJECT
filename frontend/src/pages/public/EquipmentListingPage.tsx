import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Truck, Tag, Calendar, Phone, Mail, X, CheckCircle } from 'lucide-react'

const CATEGORIES = ['All', 'Dozers', 'Excavators', 'Loaders', 'Graders', 'Cranes', 'Forklifts']

const LISTINGS = [
  { id: 1, name: 'CAT D6T XL Dozer', category: 'Dozers', year: 2021, hours: 1200, condition: 'Excellent', type: 'For Sale', price: '$285,000', image: '🚜', description: 'Low hours, fully serviced, ROPS cab, AC, GPS ready. One owner machine in excellent condition.' },
  { id: 2, name: 'John Deere 350G LC Excavator', category: 'Excavators', year: 2020, hours: 2800, condition: 'Good', type: 'For Rent', price: '$4,200/mo', image: '🏗️', description: 'Full size excavator, 36" bucket included. Available for long-term rental with service included.' },
  { id: 3, name: 'Komatsu WA380 Wheel Loader', category: 'Loaders', year: 2022, hours: 650, condition: 'Like New', type: 'For Sale', price: '$195,000', image: '🚛', description: 'Like new condition. Joystick steering, ride control, AC cab. Warranty transferable.' },
  { id: 4, name: 'CAT 140M Motor Grader', category: 'Graders', year: 2019, hours: 3400, condition: 'Good', type: 'For Rent', price: '$5,800/mo', image: '🚧', description: 'Slope control, auto articulation, front blade available. Great for road maintenance contracts.' },
  { id: 5, name: 'Liebherr LTM 1100 Crane', category: 'Cranes', year: 2020, hours: 900, condition: 'Excellent', type: 'For Rent', price: '$12,000/mo', image: '🏚️', description: '100-ton capacity, 52m main boom. Fully certified, operator available upon request.' },
  { id: 6, name: 'Toyota 8FGU25 Forklift', category: 'Forklifts', year: 2023, hours: 300, condition: 'Like New', type: 'For Sale', price: '$28,500', image: '🔧', description: '5,000 lb capacity, propane, 3-stage mast, side shift. Perfect for warehouse operations.' },
  { id: 7, name: 'Volvo EC220E Excavator', category: 'Excavators', year: 2021, hours: 1800, condition: 'Excellent', type: 'For Sale', price: '$165,000', image: '🏗️', description: 'Dig assist ready, boom suspension, EC-mode for fuel savings. Full service history available.' },
  { id: 8, name: 'CAT 950M Wheel Loader', category: 'Loaders', year: 2018, hours: 4200, condition: 'Good', type: 'For Rent', price: '$3,500/mo', image: '🚛', description: 'Production link capable, comfort series cab, multiple bucket options available with rental.' },
]

const CONDITION_COLORS: Record<string, string> = {
  'Like New': 'bg-green-100 text-green-700',
  'Excellent': 'bg-blue-100 text-blue-700',
  'Good': 'bg-amber-100 text-amber-700',
}

interface QuoteForm {
  name: string
  email: string
  phone: string
  message: string
}

const EquipmentListingPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeType, setActiveType] = useState<'All' | 'For Sale' | 'For Rent'>('All')
  const [selectedEquipment, setSelectedEquipment] = useState<typeof LISTINGS[0] | null>(null)
  const [form, setForm] = useState<QuoteForm>({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const filtered = LISTINGS.filter(eq => {
    const matchSearch = eq.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || eq.category === activeCategory
    const matchType = activeType === 'All' || eq.type === activeType
    return matchSearch && matchCategory && matchType
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const closeModal = () => {
    setSelectedEquipment(null)
    setSubmitted(false)
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
              <Truck size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">HeavyTrack CRM</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <Link to="/features" className="hover:text-amber-500 transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-amber-500 transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-amber-500 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>
          </div>
          <Link to="/login" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
            Log in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gray-900 text-white py-14 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Equipment Marketplace</p>
          <h1 className="text-4xl font-bold mb-3">Buy or Rent Heavy Equipment</h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Browse our available fleet. Request a quote directly and our team will get back to you within one business hour.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-2">
              {(['All', 'For Sale', 'For Rent'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeType === type ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">{filtered.length} machines available</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Truck size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No equipment matches your search</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(eq => (
              <div key={eq.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col">
                <div className="bg-gray-50 rounded-t-2xl p-8 flex items-center justify-center text-5xl">
                  {eq.image}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{eq.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      eq.type === 'For Sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {eq.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONDITION_COLORS[eq.condition]}`}>
                      {eq.condition}
                    </span>
                    <span className="text-xs text-gray-400">{eq.year} · {eq.hours.toLocaleString()} hrs</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{eq.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-amber-600">{eq.price}</span>
                    <button
                      onClick={() => { setSelectedEquipment(eq); setForm(f => ({ ...f, message: `I'm interested in the ${eq.name} (${eq.type}).` })) }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Don't see what you need?</h2>
          <p className="text-gray-400 text-sm mb-5">Call us or send a message — we have additional inventory not listed here.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="tel:2255550100" className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
              <Phone size={15} /> (225) 555-0100
            </a>
            <a href="mailto:hello@heavytrack.com" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
              <Mail size={15} /> hello@heavytrack.com
            </a>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Request a Quote</h2>
                <p className="text-xs text-gray-500 mt-0.5">{selectedEquipment.name}</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Request Sent!</h3>
                <p className="text-gray-500 text-sm mb-5">We'll get back to you within one business hour.</p>
                <button onClick={closeModal} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-amber-500" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EquipmentListingPage