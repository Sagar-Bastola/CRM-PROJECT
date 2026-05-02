import api from './axios'
import { EquipmentCategory, CreateEquipmentCategoryDto } from '../types'

export const getCategories = () =>
  api.get<EquipmentCategory[]>('/equipmentcategories')

export const getCategory = (id: number) =>
  api.get<EquipmentCategory>(`/equipmentcategories/${id}`)

export const createCategory = (data: CreateEquipmentCategoryDto) =>
  api.post<EquipmentCategory>('/equipmentcategories', data)

export const updateCategory = (id: number, data: CreateEquipmentCategoryDto) =>
  api.put<EquipmentCategory>(`/equipmentcategories/${id}`, data)

export const deleteCategory = (id: number) =>
  api.delete(`/equipmentcategories/${id}`)