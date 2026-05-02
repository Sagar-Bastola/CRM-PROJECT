import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Building2, Trash2 } from 'lucide-react'
import { useContact, useDeleteContact } from '../../../hooks/useContacts'
import NotesPanel from '../../../components/shared/NotesPanel'
import TasksPanel from '../../../components/shared/TasksPanel'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import LoadingSpinner from '../../../components/shared/LoadingSpinner'

const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contactId = Number(id)
  const { data: contact, isLoading } = useContact(contactId)
  const deleteContact = useDeleteContact()
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes')

  const handleDelete = async () => {
    if (!confirm('Delete this contact?')) return
    await deleteContact.mutateAsync(contactId)
    navigate('/app/contacts')
  }

  if (isLoading) return <LoadingSpinner text="Loading contact..." />
  if (!contact) return <div className="p-6 text-gray-500">Contact not found.</div>

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/app/contacts')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <Avatar name={contact.name} size="lg" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{contact.name}</h1>
          <p className="text-sm text-gray-500">{contact.position || 'No position'}</p>
        </div>
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 size={14} /> Delete
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3 h-fit">
          <h2 className="font-semibold text-gray-800 text-sm border-b border-gray-50 pb-2">Contact Details</h2>
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} className="text-gray-400" />
              <a href={`mailto:${contact.email}`} className="text-amber-500 hover:underline">{contact.email}</a>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} className="text-gray-400" />{contact.phone}
            </div>
          )}
          {contact.companyName && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} className="text-gray-400" />
              <button onClick={() => navigate(`/app/companies/${contact.companyID}`)} className="text-amber-500 hover:underline">
                {contact.companyName}
              </button>
            </div>
          )}
          <div className="pt-2 border-t border-gray-50">
            <p className="text-xs text-gray-400">Added: {new Date(contact.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {['notes', 'tasks'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all capitalize ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'notes' && <NotesPanel recordType="Contact" recordId={contactId} />}
          {activeTab === 'tasks' && <TasksPanel recordType="Contact" recordId={contactId} />}
        </div>
      </div>
    </div>
  )
}

export default ContactDetailPage