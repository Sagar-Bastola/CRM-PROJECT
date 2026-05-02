import React from 'react'
import { Bell } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useBranches } from '../../hooks/useBranches'

interface Props {
  title: string
  action?: React.ReactNode
}

const Topbar: React.FC<Props> = ({ title, action }) => {
  const user = useAuthStore(s => s.user)
  const { data: branches } = useBranches()

  return (
    <div className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0">
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        {branches && branches.length > 0 && (
          <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-amber-500 bg-gray-50">
            <option value="">All Branches</option>
            {branches.map(b => (
              <option key={b.branchID} value={b.branchID}>{b.name}</option>
            ))}
          </select>
        )}
        {action}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default Topbar