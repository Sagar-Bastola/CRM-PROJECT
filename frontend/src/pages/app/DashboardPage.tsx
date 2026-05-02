import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Truck, TrendingUp, Layers, CheckSquare, AlertTriangle } from 'lucide-react'
import { useCompanies } from '../../hooks/useCompanies'
import { useLeads } from '../../hooks/useLeads'
import { useEquipment } from '../../hooks/useEquipment'
import { useOpportunities } from '../../hooks/useOpportunities'
import { useTasksByUser } from '../../hooks/useTasks'
import { useAuthStore } from '../../store/authStore'
import KpiCard from '../../components/shared/KpiCard'
import Badge, { getStatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { data: companies, isLoading: loadingC } = useCompanies()
  const { data: leads, isLoading: loadingL } = useLeads()
  const { data: equipment, isLoading: loadingE } = useEquipment()
  const { data: opportunities, isLoading: loadingO } = useOpportunities()
  const { data: tasks } = useTasksByUser(user?.userID || 0)

  const openLeads = leads?.filter(l => l.status !== 'Rejected' && l.status !== 'Closed') || []
  const openOpps = opportunities?.filter(o => o.status === 'Open') || []
  const pipeline = openOpps.reduce((sum, o) => sum + (o.value || 0), 0)
  const overdueTasks = tasks?.filter(t => !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date()) || []
  const openTasks = tasks?.filter(t => !t.isCompleted) || []

  if (loadingC || loadingL || loadingE || loadingO) return <LoadingSpinner text="Loading dashboard..." />

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-amber-500">{user?.username}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening at your dealership today.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Companies" value={companies?.length || 0} delta="Total accounts" deltaType="up"
          icon={<Building2 size={18} />} color="bg-blue-500" />
        <KpiCard label="Open Leads" value={openLeads.length} delta={`${leads?.length || 0} total`} deltaType="up"
          icon={<TrendingUp size={18} />} color="bg-amber-500" />
        <KpiCard label="Active Fleet" value={equipment?.length || 0} delta="Machines tracked" deltaType="up"
          icon={<Truck size={18} />} color="bg-green-500" />
        <KpiCard label="Pipeline Value" value={`$${(pipeline / 1000).toFixed(0)}K`} delta={`${openOpps.length} open opps`} deltaType="up"
          icon={<Layers size={18} />} color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Equipment */}
        <div className="bg-white rounded-xl border border-gray-100 lg:col-span-1">
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Recent Equipment</h2>
            <button onClick={() => navigate('/app/equipment')} className="text-xs text-amber-500 hover:text-amber-700">View all →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {equipment?.slice(0, 5).map(eq => (
              <div key={eq.equipmentID} onClick={() => navigate(`/app/equipment/${eq.equipmentID}`)}
                className="flex items-center gap-3 p-3.5 hover:bg-amber-50 cursor-pointer transition-colors">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck size={16} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{eq.name}</p>
                  <p className="text-xs text-gray-400 truncate">{eq.companyName} · {eq.categoryName}</p>
                </div>
              </div>
            ))}
            {!equipment?.length && <p className="text-sm text-gray-400 text-center py-6">No equipment yet</p>}
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">Lead Pipeline</h2>
            <button onClick={() => navigate('/app/leads')} className="text-xs text-amber-500 hover:text-amber-700">View all →</button>
          </div>

          {/* Stage counts */}
          <div className="grid grid-cols-4 gap-2 p-4 border-b border-gray-50">
            {['New', 'Qualified', 'Proposal', 'Closed'].map(stage => {
              const count = leads?.filter(l => l.status === stage).length || 0
              const colors: Record<string, string> = { New: 'bg-blue-100 text-blue-700', Qualified: 'bg-green-100 text-green-700', Proposal: 'bg-amber-100 text-amber-700', Closed: 'bg-gray-100 text-gray-600' }
              return (
                <div key={stage} className="text-center">
                  <div className={`text-xs font-semibold px-2 py-1 rounded-lg ${colors[stage]}`}>{stage}</div>
                  <p className="text-xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
              )
            })}
          </div>

          <div className="divide-y divide-gray-50">
            {leads?.slice(0, 4).map(lead => (
              <div key={lead.leadID} onClick={() => navigate('/app/leads')}
                className="flex items-center gap-3 p-3.5 hover:bg-amber-50 cursor-pointer transition-colors">
                <Avatar name={lead.companyName || 'L'} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{lead.companyName}</p>
                  <p className="text-xs text-gray-400">{lead.source || 'No source'}</p>
                </div>
                <Badge variant={getStatusBadge(lead.status)} size="sm">{lead.status}</Badge>
              </div>
            ))}
            {!leads?.length && <p className="text-sm text-gray-400 text-center py-6">No leads yet</p>}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 text-sm">My Tasks</h2>
            <button onClick={() => navigate('/app/tasks')} className="text-xs text-amber-500 hover:text-amber-700">View all →</button>
          </div>
          {overdueTasks.length > 0 && (
            <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 font-medium">{overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} overdue</p>
            </div>
          )}
          <div className="divide-y divide-gray-50 mt-2">
            {openTasks.slice(0, 6).map(task => (
              <div key={task.taskID} className="flex items-start gap-3 p-3.5">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  task.dueDate && new Date(task.dueDate) < new Date() ? 'bg-red-500' :
                  task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString() ? 'bg-amber-500' : 'bg-green-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{task.subject}</p>
                  {task.dueDate && (
                    <p className={`text-xs mt-0.5 ${task.dueDate && new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {!openTasks.length && (
              <div className="flex items-center gap-2 p-4 text-green-600">
                <CheckSquare size={16} />
                <p className="text-sm">All tasks complete!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Companies */}
      <div className="mt-5 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 text-sm">Recent Companies</h2>
          <button onClick={() => navigate('/app/companies')} className="text-xs text-amber-500 hover:text-amber-700">View all →</button>
        </div>
        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-50">
          {companies?.slice(0, 3).map(company => (
            <div key={company.companyID} onClick={() => navigate(`/app/companies/${company.companyID}`)}
              className="p-4 hover:bg-amber-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Avatar name={company.name} size="md" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{company.name}</p>
                  <p className="text-xs text-gray-400">{company.city || 'No city'}, {company.state || ''}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{company.branchName || 'No branch'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage