import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'purple'
  size?: 'sm' | 'md'
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', size = 'md' }) => {
  const variants = {
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export default Badge

export const getStatusBadge = (status: string) => {
  const s = status?.toLowerCase()
  if (['active', 'qualified', 'won', 'open', 'completed', 'closed won'].includes(s)) return 'green'
  if (['new', 'discovery', 'proposal', 'draft', 'sent'].includes(s)) return 'blue'
  if (['in service', 'pm due', 'negotiation', 'pending'].includes(s)) return 'amber'
  if (['rejected', 'lost', 'inactive', 'closed lost', 'deleted'].includes(s)) return 'red'
  if (['admin'].includes(s)) return 'purple'
  return 'gray'
}