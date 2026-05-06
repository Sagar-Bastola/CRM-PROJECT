import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getServiceRecords, createServiceRecord, deleteServiceRecord } from '../api/serviceRecords.api'

export const useServiceRecords = (equipmentId: number) =>
  useQuery({
    queryKey: ['service-records', equipmentId],
    queryFn: () => getServiceRecords(equipmentId).then(r => r.data),
    enabled: !!equipmentId,
  })

export const useCreateServiceRecord = (equipmentId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => createServiceRecord(equipmentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['service-records', equipmentId] })
      qc.invalidateQueries({ queryKey: ['equipment'] })
    },
  })
}

export const useDeleteServiceRecord = (equipmentId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteServiceRecord(equipmentId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['service-records', equipmentId] }),
  })
}