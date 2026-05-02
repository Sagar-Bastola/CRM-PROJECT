import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategories, createCategory,
  updateCategory, deleteCategory,
} from '../api/equipmentCategories.api'
import { CreateEquipmentCategoryDto } from '../types'

export const useEquipmentCategories = () =>
  useQuery({
    queryKey: ['equipmentCategories'],
    queryFn: () => getCategories().then(r => r.data),
  })

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEquipmentCategoryDto) => createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipmentCategories'] }),
  })
}

export const useUpdateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateEquipmentCategoryDto }) =>
      updateCategory(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipmentCategories'] }),
  })
}

export const useDeleteCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['equipmentCategories'] }),
  })
}