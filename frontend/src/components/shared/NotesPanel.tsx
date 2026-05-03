import React, { useState } from 'react'
import { Send, Trash2, FileText, Edit, Check, X } from 'lucide-react'
import { useNotesByRecord, useCreateNote, useDeleteNote, useUpdateNote } from '../../hooks/useNotes'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../ui/Avatar'
import LoadingSpinner from './LoadingSpinner'
import { Note } from '../../types'

interface Props {
  recordType: string
  recordId: number
}

const NotesPanel: React.FC<Props> = ({ recordType, recordId }) => {
  const [text, setText] = useState('')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [editText, setEditText] = useState('')

  const { data: notes, isLoading } = useNotesByRecord(recordType, recordId)
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()
  const updateNote = useUpdateNote()
  const user = useAuthStore(s => s.user)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    await createNote.mutateAsync({ relatedRecordID: recordId, relatedRecordType: recordType, noteText: text })
    setText('')
  }

  const handleEditOpen = (note: Note) => {
    setEditingNote(note)
    setEditText(note.noteText)
  }

  const handleEditCancel = () => {
    setEditingNote(null)
    setEditText('')
  }

  const handleEditSave = async () => {
    if (!editingNote || !editText.trim()) return
    await updateNote.mutateAsync({ id: editingNote.noteID, data: { noteText: editText } })
    setEditingNote(null)
    setEditText('')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <FileText size={16} className="text-amber-500" />
        <h3 className="font-semibold text-gray-800 text-sm">Notes</h3>
        <span className="ml-auto text-xs text-gray-400">{notes?.length || 0} notes</span>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-b border-gray-50">
        <div className="flex gap-3">
          {user && <Avatar name={user.username} size="sm" />}
          <div className="flex-1 flex gap-2">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!text.trim() || createNote.isPending}
              className="self-end p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </form>

      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner size="sm" />
        ) : notes?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No notes yet</p>
        ) : (
          notes?.map(note => (
            <div key={note.noteID} className="p-4 flex gap-3 group">
              <Avatar name={note.authorUsername || 'U'} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">{note.authorUsername}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    {editingNote?.noteID !== note.noteID && (
                      <>
                        <button
                          onClick={() => handleEditOpen(note)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-amber-500 transition-all"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => deleteNote.mutate(note.noteID)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingNote?.noteID === note.noteID ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={2}
                      autoFocus
                      className="w-full text-sm border border-amber-400 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleEditSave}
                        disabled={!editText.trim() || updateNote.isPending}
                        className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <Check size={11} /> Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg transition-colors"
                      >
                        <X size={11} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">{note.noteText}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotesPanel