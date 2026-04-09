import api from './axios'
import { Branch, CreateBranchDto, UpdateBranchDto } from '../types'

export const getBranches = () =>
  api.get<Branch[]>('/branches')

export const getBranch = (id: number) =>
  api.get<Branch>(`/branches/${id}`)

export const createBranch = (data: CreateBranchDto) =>
  api.post<Branch>('/branches', data)

export const updateBranch = (id: number, data: UpdateBranchDto) =>
  api.put<Branch>(`/branches/${id}`, data)

export const deleteBranch = (id: number) =>
  api.delete(`/branches/${id}`)