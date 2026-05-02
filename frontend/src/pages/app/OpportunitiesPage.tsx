import React, { useState } from 'react'
import { Plus, DollarSign } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useOpportunities, useCreateOpportunity, useUpdateOpportunity, useDeleteOpportunity } from '../../hooks/useOpportunities'
import { useCompanies } from '../../hooks/useCompanies'
import { useContacts } from '../../hooks/useContacts'
import { CreateOpportunityDto, Opportunity } from '../../types'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge, { getStatusBadge } from '../../components/ui/Badge'
import PageHeader from '../../components/shared/PageHeader'
import Avatar from '../../components/ui/Avatar'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
const STATUSES = ['Open', 'Won', 'Lost']

const OpportunitiesPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [editOpp, setEditOpp] = useState<Opportunity | null>(null)

  const { data: opportunities = [], isLoading } = useOpportunities()
  const { data: companies = [] } = useCompanies()
  const { data: contacts = [] } = useContacts()
  const createOpp = useCreateOpportunity()
  const updateOpp = useUpdateOpportunity()
  const deleteOpp = useDeleteOpportunity()

  const { register, handleSubmit, reset, setValue } = useForm<CreateOpportunityDto>()

  const openEdit = (opp: Opportunity) => {
    setEditOpp(opp)
    setValue('companyID', opp.companyID)
    setValue('name', opp.name)
    setValue('value', opp.value)
    setValue('stage', opp.stage)
    setValue('status', opp.status)
    setShowModal(true)
  }

  const onSubmit = async (data: CreateOpportunityDto) => {
    if (editOpp) {
      await updateOpp.mutateAsync({ id: editOpp.opportunityID, data })
    } else {
      await createOpp.mutateAsync(data)
    }
    reset()
    setEditOpp(null)
    setShowModal(false)
  }

  const totalPipeline = opportunities.filter(o => o.status === 'Open').reduce((sum, o) => sum + (o.value || 0), 0)

  if (isLoading) return <LoadingSpinner text="Loading opportunities..." />

  return (
    <div className="p-6">
      <PageHeader
        title="Opportunities"
        subtitle={`$${totalPipeline.toLocaleString()} total pipeline`}
        action={<Button onClick={() => { setEditOpp(null); reset(); setShowModal(true) }}><Plus size={16} /> New Opportunity</Button>}
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageOpps = opportunities.filter(o => o.stage === stage)
          const stageValue = stageOpps.reduce((sum, o) => sum + (o.value || 0), 0)
          return (
            <div key={stage} className="min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stage}</p>
                  <p className="text-xs text-gray-400">{stageOpps.length} · ${(stageValue / 1000).toFixed(0)}K</p>
                </div>
                <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600 font-medium">
                  {stageOpps.length}
                </span>
              </div>
              <div className="space-y-3">
                {stageOpps.map(opp => (
                  <div key={opp.opportunityID}
                    className="bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer"
                    onClick={() => openEdit(opp)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Avatar name={opp.companyName || 'O'} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-xs leading-tight truncate">{opp.name}</p>
                        <p className="text-xs text-gray-400 truncate">{opp.companyName}</p>
                      </div>
                    </div>
                    {opp.value && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <DollarSign size={12} />
                        <span className="text-sm font-bold">{opp.value.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={getStatusBadge(opp.status)} size="sm">{opp.status}</Badge>
                      {opp.closeDate && (
                        <span className="text-xs text-gray-400">{new Date(opp.closeDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
                {stageOpps.length === 0 && (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400">No opportunities</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); setEditOpp(null) }}
        title={editOpp ? 'Edit Opportunity' : 'New Opportunity'}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset(); setEditOpp(null) }}>Cancel</Button>
            {editOpp && (
              <Button variant="danger" onClick={() => { deleteOpp.mutate(editOpp.opportunityID); setShowModal(false) }}>Delete</Button>
            )}
            <Button form="opp-form" type="submit" loading={createOpp.isPending || updateOpp.isPending}>
              {editOpp ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="opp-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Opportunity Name *" placeholder="Gulf Coast — 2× CAT Dozers" {...register('name', { required: true })} />
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
          <Input label="Value ($)" type="number" placeholder="480000" {...register('value', { valueAsNumber: true })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('stage')}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('status')}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <Input label="Close Date" type="date" {...register('closeDate')} />
        </form>
      </Modal>
    </div>
  )
}

export default OpportunitiesPage