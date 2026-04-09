import api from './axios'
import { Opportunity, CreateOpportunityDto, UpdateOpportunityDto } from '../types'

export const getOpportunities = () =>
  api.get<Opportunity[]>('/opportunities')

export const getOpportunity = (id: number) =>
  api.get<Opportunity>(`/opportunities/${id}`)

export const createOpportunity = (data: CreateOpportunityDto) =>
  api.post<Opportunity>('/opportunities', data)

export const updateOpportunity = (id: number, data: UpdateOpportunityDto) =>
  api.put<Opportunity>(`/opportunities/${id}`, data)

export const deleteOpportunity = (id: number) =>
  api.delete(`/opportunities/${id}`)