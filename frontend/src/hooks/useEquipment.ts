import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEquipment, getEquipmentById, getEquipmentByCompany,
  createEquipment, updateEquipment, deleteEquipment,
} from '../api/equipment.api'
import { CreateEquipmentDto, UpdateEquipmentDto } from '../types'

export const useEquipment = () =>
  useQuery({
    queryKey: ['equipment'],
    queryFn: () => getEquipment().then(r => r.data),
  })

export const useEquipmentById = (id: number) =>
  useQuery({
    queryKey: ['equipment', id],
    queryFn: () => getEquipmentById(id).then(r => r.data),
    enabled: !!id,
  })

export const useEquipmentByCompany = (companyId: number) =>
  useQuery({
    queryKey: ['equipment', 'company', companyId],
    queryFn: () => getEquipmentByCompany(companyId).then(r => r.data),
    enabled: !!companyId,
  })

export const useCreateEquipment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEquipmentDto) => createEquipment(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment'] }),
  })
}

export const useUpdateEquipment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEquipmentDto }) =>
      updateEquipment(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment'] }),
  })
}

export const useDeleteEquipment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEquipment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipment'] }),
  })
}