import api from './axios'
import { Note, CreateNoteDto, UpdateNoteDto } from '../types'

export const getNotesByRecord = (recordType: string, recordId: number) =>
  api.get<Note[]>(`/notes/by-record/${recordType}/${recordId}`)

export const getNote = (id: number) =>
  api.get<Note>(`/notes/${id}`)

export const createNote = (data: CreateNoteDto) =>
  api.post<Note>('/notes', data)

export const updateNote = (id: number, data: UpdateNoteDto) =>
  api.put<Note>(`/notes/${id}`, data)

export const deleteNote = (id: number) =>
  api.delete(`/notes/${id}`)