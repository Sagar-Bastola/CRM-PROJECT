import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBranches, createBranch, updateBranch, deleteBranch } from '../api/branches.api'
import { CreateBranchDto, UpdateBranchDto } from '../types'

export const useBranches = () =>
  useQuery({
    queryKey: ['branches'],
    queryFn: () => getBranches().then(r => r.data),
  })

export const useCreateBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBranchDto) => createBranch(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  })
}

export const useUpdateBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchDto }) =>
      updateBranch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  })
}

export const useDeleteBranch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteBranch(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['branches'] }),
  })
}