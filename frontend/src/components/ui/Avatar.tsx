import React from 'react'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

const colors = [
  'bg-amber-500','bg-blue-500','bg-green-500','bg-purple-500',
  'bg-red-500','bg-indigo-500','bg-pink-500','bg-teal-500',
]

const Avatar: React.FC<AvatarProps> = ({ name, size = 'md' }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const colorIndex = name.charCodeAt(0) % colors.length
  const bg = colors[colorIndex]

  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg',
  }

  return (
    <div className={`${sizes[size]} ${bg} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {initials}
    </div>
  )
}

export default Avatar