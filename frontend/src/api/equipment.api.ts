import api from './axios'
import { Equipment, CreateEquipmentDto, UpdateEquipmentDto } from '../types'

export const getEquipment = () =>
  api.get<Equipment[]>('/equipments')

export const getEquipmentById = (id: number) =>
  api.get<Equipment>(`/equipments/${id}`)

export const getEquipmentByCompany = (companyId: number) =>
  api.get<Equipment[]>(`/equipments/by-company/${companyId}`)

export const createEquipment = (data: CreateEquipmentDto) =>
  api.post<Equipment>('/equipments', data)

export const updateEquipment = (id: number, data: UpdateEquipmentDto) =>
  api.put<Equipment>(`/equipments/${id}`, data)

export const deleteEquipment = (id: number) =>
  api.delete(`/equipments/${id}`)