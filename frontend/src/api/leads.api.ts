import api from './axios'
import { Lead, CreateLeadDto, UpdateLeadDto } from '../types'

export const getLeads = () =>
  api.get<Lead[]>('/leads')

export const getLead = (id: number) =>
  api.get<Lead>(`/leads/${id}`)

export const createLead = (data: CreateLeadDto) =>
  api.post<Lead>('/leads', data)

export const updateLead = (id: number, data: UpdateLeadDto) =>
  api.put<Lead>(`/leads/${id}`, data)

export const deleteLead = (id: number) =>
  api.delete(`/leads/${id}`)