import React from 'react'

interface Props {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'up' | 'down' | 'warn'
  icon?: React.ReactNode
  color?: string
}

const KpiCard: React.FC<Props> = ({ label, value, delta, deltaType = 'up', icon, color = 'bg-amber-500' }) => {
  const deltaColors = {
    up: 'text-green-600',
    down: 'text-red-500',
    warn: 'text-amber-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        {icon && (
          <div className={`p-2 ${color} bg-opacity-10 rounded-lg`}>
            <div className={`${color.replace('bg-', 'text-')}`}>{icon}</div>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {delta && (
        <p className={`text-xs font-medium ${deltaColors[deltaType]}`}>{delta}</p>
      )}
    </div>
  )
}

export default KpiCard