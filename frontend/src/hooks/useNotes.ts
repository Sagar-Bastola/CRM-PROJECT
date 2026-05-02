import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotesByRecord, createNote,
  updateNote, deleteNote,
} from '../api/notes.api'
import { CreateNoteDto, UpdateNoteDto } from '../types'

export const useNotesByRecord = (recordType: string, recordId: number) =>
  useQuery({
    queryKey: ['notes', recordType, recordId],
    queryFn: () => getNotesByRecord(recordType, recordId).then(r => r.data),
    enabled: !!recordId,
  })

export const useCreateNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNoteDto) => createNote(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export const useUpdateNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoteDto }) =>
      updateNote(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export const useDeleteNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}