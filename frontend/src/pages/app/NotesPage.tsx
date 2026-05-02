import React, { useState } from 'react'
import { FileText, Trash2 } from 'lucide-react'
import { useNotesByRecord, useDeleteNote } from '../../hooks/useNotes'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'

const TYPES = ['Company', 'Contact', 'Equipment', 'Lead', 'Opportunity']
const TYPE_COLORS: Record<string, 'blue' | 'green' | 'amber' | 'purple' | 'gray'> = {
  Company: 'blue', Contact: 'green', Equipment: 'amber', Lead: 'purple', Opportunity: 'gray',
}

const NotesPage: React.FC = () => {
  const [activeType, setActiveType] = useState('Company')
  const [recordId, setRecordId] = useState(1)
  const { data: notes = [], isLoading } = useNotesByRecord(activeType, recordId)
  const deleteNote = useDeleteNote()

  return (
    <div className="p-6">
      <PageHeader title="Notes" subtitle="Activity log across all records" />

      <div className="flex gap-2 mb-5 flex-wrap">
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeType === t ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300'
            }`}
          >
            {t}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-gray-500">Record ID:</label>
          <input type="number" value={recordId} onChange={e => setRecordId(Number(e.target.value))} min={1}
            className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-amber-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : notes.length === 0 ? (
          <EmptyState title={`No notes for ${activeType} #${recordId}`} description="Notes added to this record will appear here."
            icon={<FileText size={28} />} />
        ) : (
          <div className="divide-y divide-gray-50">
            {notes.map(note => (
              <div key={note.noteID} className="flex gap-4 p-4 group hover:bg-gray-50 transition-colors">
                <Avatar name={note.authorUsername || 'U'} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">{note.authorUsername}</span>
                    <Badge variant={TYPE_COLORS[note.relatedRecordType] || 'gray'} size="sm">
                      {note.relatedRecordType} #{note.relatedRecordID}
                    </Badge>
                    <span className="text-xs text-gray-400 ml-auto">{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{note.noteText}</p>
                </div>
                <button onClick={() => deleteNote.mutate(note.noteID)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all flex-shrink-0 self-start mt-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotesPage