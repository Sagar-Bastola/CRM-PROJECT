import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCircle,
  Truck,
  Tag,
  CheckSquare,
  FileText,
  LogOut,
  Layers,
  GitBranch,
  TrendingUp,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
  end?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/app', icon: LayoutDashboard, end: true },
]

const salesItems: NavItem[] = [
  { label: 'Leads', path: '/app/leads', icon: TrendingUp },
  { label: 'Opportunities', path: '/app/opportunities', icon: Layers },
]

const accountItems: NavItem[] = [
  { label: 'Companies', path: '/app/companies', icon: Building2 },
  { label: 'Contacts', path: '/app/contacts', icon: UserCircle },
]

const fleetItems: NavItem[] = [
  { label: 'Equipment', path: '/app/equipment', icon: Truck },
]

const activityItems: NavItem[] = [
  { label: 'Tasks', path: '/app/tasks', icon: CheckSquare },
  { label: 'Notes', path: '/app/notes', icon: FileText },
]

const adminItems: NavItem[] = [
  { label: 'Users', path: '/app/users', icon: Users },
  { label: 'Branches', path: '/app/branches', icon: GitBranch },
  { label: 'Equipment Categories', path: '/app/eq-categories', icon: Tag },
]

const NavSection: React.FC<{ title: string; items: NavItem[] }> = ({ title, items }) => (
  <div className="mb-2">
    {title && (
      <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
        {title}
      </p>
    )}
    {items.map(item => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end ?? false}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-all ${
            isActive
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-200'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`
        }
      >
        <item.icon size={16} />
        {item.label}
      </NavLink>
    ))}
  </div>
)

const Sidebar: React.FC = () => {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-56 bg-gray-900 flex flex-col h-screen flex-shrink-0">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Truck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">HeavyTrack</p>
            <p className="text-gray-500 text-xs mt-0.5">Dealer CRM</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <NavSection title="" items={navItems} />
        <NavSection title="Sales" items={salesItems} />
        <NavSection title="Accounts" items={accountItems} />
        <NavSection title="Fleet" items={fleetItems} />
        <NavSection title="Activity" items={activityItems} />
        {user?.role === 'Admin' && (
          <NavSection title="Admin" items={adminItems} />
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.username}</p>
            <p className="text-gray-500 text-xs truncate">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar