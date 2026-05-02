import React, { useState } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, AlertTriangle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import { useUsers } from '../../hooks/useUsers'
import { CreateTaskDto } from '../../types'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/shared/PageHeader'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import EmptyState from '../../components/shared/EmptyState'

const RECORD_TYPES = ['Company', 'Contact', 'Equipment', 'Lead', 'Opportunity']

const TasksPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'open' | 'overdue' | 'completed'>('open')

  const { data: tasks = [], isLoading } = useTasks()
  const { data: users = [] } = useUsers()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const { register, handleSubmit, reset } = useForm<CreateTaskDto>()

  const filtered = tasks.filter(t => {
    if (filter === 'open') return !t.isCompleted
    if (filter === 'completed') return t.isCompleted
    if (filter === 'overdue') return !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date()
    return true
  })

  const overdueCount = tasks.filter(t => !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date()).length

  const onSubmit = async (data: CreateTaskDto) => {
    await createTask.mutateAsync(data)
    reset()
    setShowModal(false)
  }

  if (isLoading) return <LoadingSpinner text="Loading tasks..." />

  return (
    <div className="p-6">
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.filter(t => !t.isCompleted).length} open tasks`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> New Task</Button>}
      />

      {overdueCount > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
          <AlertTriangle size={16} />
          <strong>{overdueCount} task{overdueCount > 1 ? 's' : ''}</strong> overdue
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'open', 'overdue', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
              filter === f ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300'
            }`}
          >
            {f} ({f === 'all' ? tasks.length : f === 'open' ? tasks.filter(t => !t.isCompleted).length : f === 'overdue' ? overdueCount : tasks.filter(t => t.isCompleted).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        {filtered.length === 0 ? (
          <EmptyState title="No tasks found" description="All caught up!" />
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(task => {
              const isOverdue = !task.isCompleted && task.dueDate && new Date(task.dueDate) < new Date()
              return (
                <div key={task.taskID} className="flex items-start gap-3 p-4 hover:bg-gray-50 group transition-colors">
                  <button onClick={() => updateTask.mutate({ id: task.taskID, data: { isCompleted: !task.isCompleted } })}
                    className="mt-0.5 text-gray-300 hover:text-amber-500 transition-colors flex-shrink-0">
                    {task.isCompleted ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.subject}
                    </p>
                    {task.description && <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>}
                    <div className="flex items-center gap-3 mt-1.5">
                      <Badge variant="gray" size="sm">{task.relatedRecordType}</Badge>
                      {task.assignedToUsername && <span className="text-xs text-gray-400">→ {task.assignedToUsername}</span>}
                      {task.dueDate && (
                        <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                          {isOverdue ? '⚠ ' : ''}Due {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => deleteTask.mutate(task.taskID)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all flex-shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset() }} title="New Task"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset() }}>Cancel</Button>
            <Button form="task-form" type="submit" loading={createTask.isPending}>Create Task</Button>
          </>
        }
      >
        <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Subject *" placeholder="Call back Mike re: delivery" {...register('subject', { required: true })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} placeholder="Task details..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 resize-none"
              {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Record Type *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('relatedRecordType', { required: true })}>
                <option value="">Select type</option>
                {RECORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Input label="Record ID *" type="number" placeholder="1" {...register('relatedRecordID', { required: true, valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="date" {...register('dueDate')} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('assignedToUserID', { valueAsNumber: true })}>
                <option value="">Select user</option>
                {users.map(u => <option key={u.userID} value={u.userID}>{u.username}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TasksPage