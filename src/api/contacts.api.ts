import api from './axios'
import { Contact, CreateContactDto, UpdateContactDto } from '../types'

export const getContacts = () =>
  api.get<Contact[]>('/contacts')

export const getContact = (id: number) =>
  api.get<Contact>(`/contacts/${id}`)

export const getContactsByCompany = (companyId: number) =>
  api.get<Contact[]>(`/contacts/by-company/${companyId}`)

export const createContact = (data: CreateContactDto) =>
  api.post<Contact>('/contacts', data)

export const updateContact = (id: number, data: UpdateContactDto) =>
  api.put<Contact>(`/contacts/${id}`, data)

export const deleteContact = (id: number) =>
  api.delete(`/contacts/${id}`)