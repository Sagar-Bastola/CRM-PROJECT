import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOpportunities, createOpportunity,
  updateOpportunity, deleteOpportunity,
} from '../api/opportunities.api'
import { CreateOpportunityDto, UpdateOpportunityDto } from '../types'

export const useOpportunities = () =>
  useQuery({
    queryKey: ['opportunities'],
    queryFn: () => getOpportunities().then(r => r.data),
  })

export const useCreateOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOpportunityDto) => createOpportunity(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opportunities'] }),
  })
}

export const useUpdateOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOpportunityDto }) =>
      updateOpportunity(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opportunities'] }),
  })
}

export const useDeleteOpportunity = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteOpportunity(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opportunities'] }),
  })
}