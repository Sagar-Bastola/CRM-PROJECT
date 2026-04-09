import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Mail, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useContacts, useCreateContact } from '../../../hooks/useContacts'
import { useCompanies } from '../../../hooks/useCompanies'
import { CreateContactDto } from '../../../types'
import DataTable, { Column } from '../../../components/shared/DataTable'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Avatar from '../../../components/ui/Avatar'
import PageHeader from '../../../components/shared/PageHeader'

const ContactsPage: React.FC = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const { data: contacts = [], isLoading } = useContacts()
  const { data: companies = [] } = useCompanies()
  const createContact = useCreateContact()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateContactDto>()

  const onSubmit = async (data: CreateContactDto) => {
    await createContact.mutateAsync(data)
    reset()
    setShowModal(false)
  }

  const columns: Column<typeof contacts[0]>[] = [
    {
      key: 'name', label: 'Name', sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs text-gray-400">{row.position || 'No position'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'companyName', label: 'Company', sortable: true,
      render: (v) => <span className="text-sm text-amber-600 font-medium">{v || '—'}</span>,
    },
    {
      key: 'email', label: 'Email',
      render: (v) => v ? (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Mail size={13} className="text-gray-400" />{v}
        </div>
      ) : <span className="text-gray-400 text-xs">—</span>,
    },
    {
      key: 'phone', label: 'Phone',
      render: (v) => v ? (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Phone size={13} className="text-gray-400" />{v}
        </div>
      ) : <span className="text-gray-400 text-xs">—</span>,
    },
    {
      key: 'createdAt', label: 'Added',
      render: (v) => <span className="text-xs text-gray-400">{new Date(v).toLocaleDateString()}</span>,
    },
  ]

  return (
    <div className="p-6">
      <PageHeader
        title="Contacts"
        subtitle={`${contacts.length} total contacts`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> New Contact</Button>}
      />

      <DataTable
        columns={columns}
        data={contacts}
        isLoading={isLoading}
        onRowClick={row => navigate(`/app/contacts/${row.contactID}`)}
        keyExtractor={row => row.contactID}
        searchPlaceholder="Search contacts..."
        emptyTitle="No contacts yet"
        emptyDescription="Add your first contact to get started."
        emptyAction={{ label: '+ New Contact', onClick: () => setShowModal(true) }}
      />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset() }} title="New Contact"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset() }}>Cancel</Button>
            <Button form="contact-form" type="submit" loading={createContact.isPending}>Create Contact</Button>
          </>
        }
      >
        <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Full Name *" placeholder="Mike Tran" error={errors.name?.message} {...register('name', { required: 'Required' })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('companyID', { required: true, valueAsNumber: true })}>
              <option value="">Select company</option>
              {companies.map(c => <option key={c.companyID} value={c.companyID}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Email" type="email" placeholder="mike@company.com" {...register('email')} />
          <Input label="Phone" placeholder="(504) 555-0110" {...register('phone')} />
          <Input label="Position" placeholder="Operations Manager" {...register('position')} />
        </form>
      </Modal>
    </div>
  )
}

export default ContactsPage