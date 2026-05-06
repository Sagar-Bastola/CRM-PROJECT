import React from 'react'
import { useAuthStore } from '../../store/authStore'
import { useBranches } from '../../hooks/useBranches'
import GlobalSearch from './GlobalSearch'
import NotificationBell from './NotificationBell'

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
        <GlobalSearch />
        {branches && branches.length > 0 && (
          <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-amber-500 bg-gray-50">
            <option value="">All Branches</option>
            {branches.map(b => (
              <option key={b.branchID} value={b.branchID}>{b.name}</option>
            ))}
          </select>
        )}
        {action}
        <NotificationBell />
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default Topbar