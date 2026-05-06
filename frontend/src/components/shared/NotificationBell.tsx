import { useState, useRef, useEffect } from 'react'
import { Bell, CheckSquare, TrendingUp, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLeads } from '../../hooks/useLeads'
import { useTasks } from '../../hooks/useTasks'

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: leads } = useLeads()
  const { data: tasks } = useTasks()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const now = new Date()
  const today = now.toDateString()

  const overdueTasks = tasks?.filter(
    t => !t.isCompleted && t.dueDate && new Date(t.dueDate) < now
  ) || []

  const dueTodayTasks = tasks?.filter(
    t => !t.isCompleted && t.dueDate &&
    new Date(t.dueDate).toDateString() === today &&
    new Date(t.dueDate) >= now
  ) || []

  const noSourceLeads = leads?.filter(
    l => l.status !== 'Closed' && l.status !== 'Rejected' && !l.source
  ) || []

  const total = overdueTasks.length + dueTodayTasks.length + noSourceLeads.length

  const handleNavigate = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
      >
        <Bell size={18} />
        {total > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
            <div className="flex items-center gap-2">
              {total > 0 && (
                <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                  {total} new
                </span>
              )}
              <button onClick={() => setOpen(false)}>
                <X size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {total === 0 ? (
              <div className="py-10 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-sm font-medium text-gray-700">You're all caught up!</p>
                <p className="text-xs text-gray-400 mt-1">No pending notifications</p>
              </div>
            ) : (
              <>
                {overdueTasks.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                      Overdue Tasks
                    </p>
                    {overdueTasks.map(task => (
                      <button
                        key={task.taskID}
                        onClick={() => handleNavigate('/app/tasks')}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors border-b border-gray-50 flex items-start gap-3"
                      >
                        <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckSquare size={13} className="text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{task.subject}</p>
                          <p className="text-xs text-red-500 mt-0.5">
                            Overdue · {new Date(task.dueDate!).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {dueTodayTasks.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                      Due Today
                    </p>
                    {dueTodayTasks.map(task => (
                      <button
                        key={task.taskID}
                        onClick={() => handleNavigate('/app/tasks')}
                        className="w-full px-4 py-3 text-left hover:bg-amber-50 transition-colors border-b border-gray-50 flex items-start gap-3"
                      >
                        <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckSquare size={13} className="text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{task.subject}</p>
                          <p className="text-xs text-amber-500 mt-0.5">Due today</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {noSourceLeads.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                      Leads Needing Attention
                    </p>
                    {noSourceLeads.map(lead => (
                      <button
                        key={lead.leadID}
                        onClick={() => handleNavigate('/app/leads')}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 flex items-start gap-3"
                      >
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp size={13} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{lead.companyName}</p>
                          <p className="text-xs text-blue-500 mt-0.5">No source assigned · {lead.status}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {total > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5">
              <button
                onClick={() => handleNavigate('/app/tasks')}
                className="text-xs text-amber-500 hover:text-amber-700 font-medium"
              >
                View all tasks →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell