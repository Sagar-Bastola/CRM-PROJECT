import api from './axios'
import { Task, CreateTaskDto, UpdateTaskDto } from '../types'

export const getTasks = () =>
  api.get<Task[]>('/tasks')

export const getTask = (id: number) =>
  api.get<Task>(`/tasks/${id}`)

export const getTasksByRecord = (recordType: string, recordId: number) =>
  api.get<Task[]>(`/tasks/by-record/${recordType}/${recordId}`)

export const getTasksByUser = (userId: number) =>
  api.get<Task[]>(`/tasks/by-user/${userId}`)

export const createTask = (data: CreateTaskDto) =>
  api.post<Task>('/tasks', data)

export const updateTask = (id: number, data: UpdateTaskDto) =>
  api.put<Task>(`/tasks/${id}`, data)

export const deleteTask = (id: number) =>
  api.delete(`/tasks/${id}`)