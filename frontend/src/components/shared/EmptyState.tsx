import React from 'react'
import { PackageSearch } from 'lucide-react'
import Button from '../ui/Button'

interface Props {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: React.ReactNode
}

const EmptyState: React.FC<Props> = ({ title, description, action, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="p-4 bg-amber-50 rounded-full mb-4 text-amber-500">
        {icon || <PackageSearch size={32} />}
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-5 max-w-xs">{description}</p>}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  )
}

export default EmptyState