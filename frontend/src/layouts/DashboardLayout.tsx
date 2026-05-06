import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/shared/Sidebar'
import Topbar from '../components/shared/Topbar'

const pageTitles: Record<string, string> = {
  '/app': 'Dashboard',
  '/app/companies': 'Companies',
  '/app/contacts': 'Contacts',
  '/app/equipment': 'Equipment',
  '/app/leads': 'Leads',
  '/app/opportunities': 'Opportunities',
  '/app/tasks': 'Tasks',
  '/app/notes': 'Notes',
  '/app/users': 'Users',
  '/app/branches': 'Branches',
  '/app/eq-categories': 'Equipment Categories',
}

const DashboardLayout: React.FC = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'HeavyTrack'

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ title }} />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout