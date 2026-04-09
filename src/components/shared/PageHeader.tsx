import React from 'react'

interface Props {
  title: string
  subtitle?: string
  action?: React.ReactNode
  breadcrumb?: string
}

const PageHeader: React.FC<Props> = ({ title, subtitle, action, breadcrumb }) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{breadcrumb}</p>
        )}
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}

export default PageHeader