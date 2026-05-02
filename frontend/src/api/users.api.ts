import api from './axios'
import { User, UpdateUserDto } from '../types'

export const getUsers = () =>
  api.get<User[]>('/users')

export const getUser = (id: number) =>
  api.get<User>(`/users/${id}`)

export const updateUser = (id: number, data: UpdateUserDto) =>
  api.put<User>(`/users/${id}`, data)

export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`)