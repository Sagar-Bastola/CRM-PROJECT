import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, updateUser, deleteUser } from '../api/users.api'
import { UpdateUserDto } from '../types'

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers().then(r => r.data),
  })

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}