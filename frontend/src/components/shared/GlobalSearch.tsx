import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, X, Building2, Users, Truck, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLeads } from '../../hooks/useLeads'
import { useCompanies } from '../../hooks/useCompanies'
import { useContacts } from '../../hooks/useContacts'
import { useEquipment } from '../../hooks/useEquipment'

const GlobalSearch = () => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: leads } = useLeads()
  const { data: companies } = useCompanies()
  const { data: contacts } = useContacts()
  const { data: equipment } = useEquipment()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setQuery(''); setOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const q = query.toLowerCase().trim()

  const results = useMemo(() => {
    if (!q) return []
    return [
      ...(leads ?? [])
        .filter((l: any) =>
          l.contactName?.toLowerCase().includes(q) ||
          l.status?.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .map((l: any) => ({
          id: l.leadID,
          label: l.contactName,
          sub: l.status,
          path: `/app/leads`,
          category: 'Leads',
        })),

      ...(companies ?? [])
        .filter((c: any) => c.name?.toLowerCase().includes(q))
        .slice(0, 3)
        .map((c: any) => ({
          id: c.companyID,
          label: c.name,
          sub: c.city ?? '',
          path: `/app/companies/${c.companyID}`,
          category: 'Companies',
        })),

      ...(contacts ?? [])
        .filter((c: any) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .map((c: any) => ({
          id: c.contactID,
          label: `${c.firstName} ${c.lastName}`,
          sub: c.email ?? '',
          path: `/app/contacts/${c.contactID}`,
          category: 'Contacts',
        })),

      ...(equipment ?? [])
        .filter((e: any) =>
          e.type?.toLowerCase().includes(q) ||
          e.serialNumber?.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .map((e: any) => ({
          id: e.equipmentID,
          label: e.type,
          sub: e.serialNumber ?? '',
          path: `/app/equipment/${e.equipmentID}`,
          category: 'Equipment',
        })),
    ]
  }, [q, leads, companies, contacts, equipment])

  const grouped = results.reduce<Record<string, typeof results>>((acc, item) => {
    acc[item.category] = [...(acc[item.category] ?? []), item]
    return acc
  }, {})

  const icons: Record<string, React.ReactNode> = {
    Leads: <TrendingUp size={12} className="text-amber-500" />,
    Companies: <Building2 size={12} className="text-blue-500" />,
    Contacts: <Users size={12} className="text-green-500" />,
    Equipment: <Truck size={12} className="text-purple-500" />,
  }

  const handleSelect = (path: string) => {
    navigate(path)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative w-60">
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:border-amber-500 focus-within:bg-white transition-all">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }}>
            <X size={13} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {open && q && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-400">
              No results for "{query}"
            </p>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-2 flex items-center gap-1.5 bg-gray-50 border-b border-gray-100">
                  {icons[category]}
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {category}
                  </span>
                </div>
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.path)}
                    className="w-full px-4 py-2.5 text-left hover:bg-amber-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    {item.sub && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch