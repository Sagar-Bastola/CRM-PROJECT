import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Truck, Menu, X } from 'lucide-react'
import Button from '../components/ui/Button'

const PublicLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/equipment-listing', label: 'Equipment' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Truck size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">HeavyTrack CRM</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-amber-600 bg-amber-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
            <Button size="sm" onClick={() => navigate('/contact')}>Request Demo</Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(m => !m)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 px-6 space-y-1">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                {l.label}
              </NavLink>
            ))}
            <div className="pt-2 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/login')}>Log in</Button>
              <Button size="sm" className="flex-1" onClick={() => navigate('/contact')}>Demo</Button>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <Truck size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm">HeavyTrack CRM</span>
          </div>
          <p className="text-xs">© 2026 HeavyTrack CRM. Built for heavy equipment dealers.</p>
          <div className="flex gap-4 text-xs">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/equipment-listing" className="hover:text-white transition-colors">Equipment</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout