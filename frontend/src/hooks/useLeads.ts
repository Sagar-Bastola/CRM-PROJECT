import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLeads, createLead, updateLead, deleteLead } from '../api/leads.api'
import { CreateLeadDto, UpdateLeadDto } from '../types'

export const useLeads = () =>
  useQuery({
    queryKey: ['leads'],
    queryFn: () => getLeads().then(r => r.data),
  })

export const useCreateLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLeadDto) => createLead(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export const useUpdateLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadDto }) =>
      updateLead(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}

export const useDeleteLead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteLead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })
}