import React, { useState } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, CheckSquare } from 'lucide-react'
import { useTasksByRecord, useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  recordType: string
  recordId: number
}

const TasksPanel: React.FC<Props> = ({ recordType, recordId }) => {
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data: tasks, isLoading } = useTasksByRecord(recordType, recordId)
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) return
    await createTask.mutateAsync({
      subject,
      dueDate: dueDate || undefined,
      relatedRecordID: recordId,
      relatedRecordType: recordType,
    })
    setSubject('')
    setDueDate('')
    setShowForm(false)
  }

  const toggleComplete = (id: number, current: boolean) => {
    updateTask.mutate({ id, data: { isCompleted: !current } })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <CheckSquare size={16} className="text-amber-500" />
        <h3 className="font-semibold text-gray-800 text-sm">Tasks</h3>
        <span className="ml-auto text-xs text-gray-400">{tasks?.filter(t => !t.isCompleted).length || 0} open</span>
        <button
          onClick={() => setShowForm(f => !f)}
          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-amber-500 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 border-b border-gray-50 flex gap-2">
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Task subject..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="px-3 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">
            Add
          </button>
        </form>
      )}

      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : tasks?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No tasks yet</p>
        ) : (
          tasks?.map(task => (
            <div key={task.taskID} className="flex items-center gap-3 p-3 group hover:bg-gray-50">
              <button onClick={() => toggleComplete(task.taskID, task.isCompleted)}>
                {task.isCompleted
                  ? <CheckCircle2 size={18} className="text-green-500" />
                  : <Circle size={18} className="text-gray-300 hover:text-amber-500" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.subject}
                </p>
                {task.dueDate && (
                  <p className={`text-xs mt-0.5 ${new Date(task.dueDate) < new Date() && !task.isCompleted ? 'text-red-500' : 'text-gray-400'}`}>
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteTask.mutate(task.taskID)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TasksPanel