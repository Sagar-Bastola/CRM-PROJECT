import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Building2, Trash2, Edit, AlertTriangle } from 'lucide-react'
import { useContact, useDeleteContact, useUpdateContact } from '../../../hooks/useContacts'
import { useCompanies } from '../../../hooks/useCompanies'
import { UpdateContactDto } from '../../../types'
import { useForm } from 'react-hook-form'
import NotesPanel from '../../../components/shared/NotesPanel'
import TasksPanel from '../../../components/shared/TasksPanel'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import LoadingSpinner from '../../../components/shared/LoadingSpinner'

const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contactId = Number(id)

  const { data: contact, isLoading } = useContact(contactId)
  const { data: companies = [] } = useCompanies()
  const deleteContact = useDeleteContact()
  const updateContact = useUpdateContact()

  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const editForm = useForm<UpdateContactDto>()

  const handleEditOpen = () => {
    if (!contact) return
    editForm.reset({
      name: contact.name,
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      position: contact.position ?? '',
      companyID: contact.companyID,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (data: UpdateContactDto) => {
    await updateContact.mutateAsync({ id: contactId, data })
    setShowEditModal(false)
  }

  const handleDelete = async () => {
    await deleteContact.mutateAsync(contactId)
    setShowDeleteModal(false)
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEditOpen}>
            <Edit size={14} /> Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
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

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Contact"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button form="edit-contact-form" type="submit" loading={updateContact.isPending}>Save Changes</Button>
          </>
        }
      >
        <form id="edit-contact-form" onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-3">
          <Input label="Full Name *" error={editForm.formState.errors.name?.message} {...editForm.register('name', { required: 'Required' })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...editForm.register('companyID', { valueAsNumber: true })}>
              <option value="">Select company</option>
              {companies.map(c => <option key={c.companyID} value={c.companyID}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Email" type="email" {...editForm.register('email')} />
          <Input label="Phone" {...editForm.register('phone')} />
          <Input label="Position" {...editForm.register('position')} />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Contact"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteContact.isPending}>Yes, Delete</Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold text-base">Are you sure you want to delete this contact?</p>
            <p className="text-gray-500 text-sm mt-1">
              <span className="font-medium text-gray-700">{contact.name}</span> will be permanently removed. This cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ContactDetailPage