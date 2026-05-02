import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getContacts, getContact, getContactsByCompany,
  createContact, updateContact, deleteContact,
} from '../api/contacts.api'
import { CreateContactDto, UpdateContactDto } from '../types'

export const useContacts = () =>
  useQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts().then(r => r.data),
  })

export const useContact = (id: number) =>
  useQuery({
    queryKey: ['contacts', id],
    queryFn: () => getContact(id).then(r => r.data),
    enabled: !!id,
  })

export const useContactsByCompany = (companyId: number) =>
  useQuery({
    queryKey: ['contacts', 'company', companyId],
    queryFn: () => getContactsByCompany(companyId).then(r => r.data),
    enabled: !!companyId,
  })

export const useCreateContact = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContactDto) => createContact(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}

export const useUpdateContact = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactDto }) =>
      updateContact(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}

export const useDeleteContact = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteContact(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}