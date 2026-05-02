import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCompanies, getCompany, createCompany,
  updateCompany, deleteCompany,
} from '../api/companies.api'
import { CreateCompanyDto, UpdateCompanyDto } from '../types'

export const useCompanies = () =>
  useQuery({
    queryKey: ['companies'],
    queryFn: () => getCompanies().then(r => r.data),
  })

export const useCompany = (id: number) =>
  useQuery({
    queryKey: ['companies', id],
    queryFn: () => getCompany(id).then(r => r.data),
    enabled: !!id,
  })

export const useCreateCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCompanyDto) => createCompany(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export const useUpdateCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyDto }) =>
      updateCompany(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export const useDeleteCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
}