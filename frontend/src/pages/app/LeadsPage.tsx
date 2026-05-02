import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../../hooks/useLeads'
import { useCompanies } from '../../hooks/useCompanies'
import { useContacts } from '../../hooks/useContacts'
import { CreateLeadDto, UpdateLeadDto, Lead } from '../../types'
import DataTable, { Column } from '../../components/shared/DataTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge, { getStatusBadge } from '../../components/ui/Badge'
import PageHeader from '../../components/shared/PageHeader'
import Avatar from '../../components/ui/Avatar'

const STATUSES = ['New', 'Qualified', 'Proposal', 'Rejected', 'Closed']

const LeadsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [editLead, setEditLead] = useState<Lead | null>(null)

  const { data: leads = [], isLoading } = useLeads()
  const { data: companies = [] } = useCompanies()
  const { data: contacts = [] } = useContacts()
  const createLead = useCreateLead()
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()

  const { register, handleSubmit, reset, setValue } = useForm<CreateLeadDto>()

  const openEdit = (lead: Lead) => {
    setEditLead(lead)
    setValue('companyID', lead.companyID)
    setValue('contactID', lead.contactID)
    setValue('source', lead.source)
    setValue('status', lead.status)
    setShowModal(true)
  }

  const onSubmit = async (data: CreateLeadDto) => {
    if (editLead) {
      await updateLead.mutateAsync({ id: editLead.leadID, data: data as UpdateLeadDto })
    } else {
      await createLead.mutateAsync(data)
    }
    reset()
    setEditLead(null)
    setShowModal(false)
  }

  const stageCounts = STATUSES.map(s => ({ status: s, count: leads.filter(l => l.status === s).length }))

  const columns: Column<Lead>[] = [
    {
      key: 'companyName', label: 'Company', sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.companyName || 'L'} size="sm" />
          <span className="font-medium text-gray-900 text-sm">{row.companyName || '—'}</span>
        </div>
      ),
    },
    { key: 'contactName', label: 'Contact', render: (v) => <span className="text-sm text-gray-600">{v || '—'}</span> },
    { key: 'source', label: 'Source', render: (v) => <span className="text-sm text-gray-600">{v || '—'}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (v) => <Badge variant={getStatusBadge(v)}>{v}</Badge> },
    { key: 'createdByUsername', label: 'Created By', render: (v) => <span className="text-xs text-gray-500">{v || '—'}</span> },
    {
      key: 'createdAt', label: 'Date', sortable: true,
      render: (v) => <span className="text-xs text-gray-400">{new Date(v).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); openEdit(row) }}>Edit</Button>
          <Button size="sm" variant="danger" onClick={e => { e.stopPropagation(); deleteLead.mutate(row.leadID) }}>Del</Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <PageHeader
        title="Leads"
        subtitle={`${leads.length} total leads`}
        action={<Button onClick={() => { setEditLead(null); reset(); setShowModal(true) }}><Plus size={16} /> New Lead</Button>}
      />

      {/* Stage summary */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {stageCounts.map(s => (
          <div key={s.status} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.count}</p>
            <Badge variant={getStatusBadge(s.status)} size="sm">{s.status}</Badge>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={leads}
        isLoading={isLoading}
        keyExtractor={row => row.leadID}
        searchPlaceholder="Search leads..."
        emptyTitle="No leads yet"
        emptyDescription="Start tracking your sales leads."
        emptyAction={{ label: '+ New Lead', onClick: () => setShowModal(true) }}
      />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); setEditLead(null) }}
        title={editLead ? 'Edit Lead' : 'New Lead'}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset(); setEditLead(null) }}>Cancel</Button>
            <Button form="lead-form" type="submit" loading={createLead.isPending || updateLead.isPending}>
              {editLead ? 'Update' : 'Create'} Lead
            </Button>
          </>
        }
      >
        <form id="lead-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('companyID', { required: true, valueAsNumber: true })}>
              <option value="">Select company</option>
              {companies.map(c => <option key={c.companyID} value={c.companyID}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('contactID', { valueAsNumber: true })}>
              <option value="">Select contact (optional)</option>
              {contacts.map(c => <option key={c.contactID} value={c.contactID}>{c.name}</option>)}
            </select>
          </div>
          <Input label="Source" placeholder="Website, Referral, Trade show..." {...register('source')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('status', { required: true })}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default LeadsPage