import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTasks, getTasksByUser, getTasksByRecord,
  createTask, updateTask, deleteTask,
} from '../api/tasks.api'
import { CreateTaskDto, UpdateTaskDto } from '../types'

export const useTasks = () =>
  useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks().then(r => r.data),
  })

export const useTasksByUser = (userId: number) =>
  useQuery({
    queryKey: ['tasks', 'user', userId],
    queryFn: () => getTasksByUser(userId).then(r => r.data),
    enabled: !!userId,
  })

export const useTasksByRecord = (recordType: string, recordId: number) =>
  useQuery({
    queryKey: ['tasks', recordType, recordId],
    queryFn: () => getTasksByRecord(recordType, recordId).then(r => r.data),
    enabled: !!recordId,
  })

export const useCreateTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskDto) => createTask(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export const useUpdateTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      updateTask(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export const useDeleteTask = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}