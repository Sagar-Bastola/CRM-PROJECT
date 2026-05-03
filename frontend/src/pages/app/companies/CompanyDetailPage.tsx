import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Globe, MapPin, Edit, Trash2, Building2, Plus, AlertTriangle } from 'lucide-react'
import { useCompany, useUpdateCompany, useDeleteCompany } from '../../../hooks/useCompanies'
import { useContactsByCompany, useCreateContact } from '../../../hooks/useContacts'
import { useEquipmentByCompany, useCreateEquipment } from '../../../hooks/useEquipment'
import { useEquipmentCategories } from '../../../hooks/useEquipmentCategories'
import { useBranches } from '../../../hooks/useBranches'
import { CreateContactDto, CreateEquipmentDto, UpdateCompanyDto } from '../../../types'
import { useForm } from 'react-hook-form'
import NotesPanel from '../../../components/shared/NotesPanel'
import TasksPanel from '../../../components/shared/TasksPanel'
import Badge, { getStatusBadge } from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import LoadingSpinner from '../../../components/shared/LoadingSpinner'

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const companyId = Number(id)

  const { data: company, isLoading } = useCompany(companyId)
  const { data: contacts = [] } = useContactsByCompany(companyId)
  const { data: equipment = [] } = useEquipmentByCompany(companyId)
  const { data: categories = [] } = useEquipmentCategories()
  const { data: branches = [] } = useBranches()

  const deleteCompany = useDeleteCompany()
  const updateCompany = useUpdateCompany()
  const createContact = useCreateContact()
  const createEquipment = useCreateEquipment()

  const [showContactModal, setShowContactModal] = useState(false)
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'contacts' | 'equipment' | 'notes' | 'tasks'>('contacts')

  const contactForm = useForm<CreateContactDto>()
  const equipmentForm = useForm<CreateEquipmentDto>()
  const editForm = useForm<UpdateCompanyDto>()

  const handleEditOpen = () => {
    if (!company) return
    editForm.reset({
      name: company.name,
      phone: company.phone ?? '',
      website: company.website ?? '',
      address1: company.address1 ?? '',
      address2: company.address2 ?? '',
      city: company.city ?? '',
      state: company.state ?? '',
      zip: company.zip ?? '',
      country: company.country ?? '',
      branchID: company.branchID,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (data: UpdateCompanyDto) => {
    await updateCompany.mutateAsync({ id: companyId, data })
    setShowEditModal(false)
  }

  const handleDelete = async () => {
    await deleteCompany.mutateAsync(companyId)
    setShowDeleteModal(false)
    navigate('/app/companies')
  }

  const handleCreateContact = async (data: CreateContactDto) => {
    await createContact.mutateAsync({ ...data, companyID: companyId })
    contactForm.reset()
    setShowContactModal(false)
  }

  const handleCreateEquipment = async (data: CreateEquipmentDto) => {
    await createEquipment.mutateAsync({ ...data, companyID: companyId })
    equipmentForm.reset()
    setShowEquipmentModal(false)
  }

  if (isLoading) return <LoadingSpinner text="Loading company..." />
  if (!company) return <div className="p-6 text-gray-500">Company not found.</div>

  const tabs = [
    { key: 'contacts', label: `Contacts (${contacts.length})` },
    { key: 'equipment', label: `Equipment (${equipment.length})` },
    { key: 'notes', label: 'Notes' },
    { key: 'tasks', label: 'Tasks' },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/app/companies')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <Avatar name={company.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-sm text-gray-500">{company.branchName || 'No branch'}</p>
          </div>
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
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm border-b border-gray-50 pb-2">Company Details</h2>
          {company.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} className="text-gray-400" /> {company.phone}
            </div>
          )}
          {company.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe size={14} className="text-gray-400" />
              <a href={company.website} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline truncate">{company.website}</a>
            </div>
          )}
          {(company.city || company.state) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={14} className="text-gray-400" />
              {[company.address1, company.city, company.state, company.zip].filter(Boolean).join(', ')}
            </div>
          )}
          {company.country && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} className="text-gray-400" /> {company.country}
            </div>
          )}
          <div className="pt-2 border-t border-gray-50 space-y-1">
            <p className="text-xs text-gray-400">Created: {new Date(company.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-gray-400">Updated: {new Date(company.lastModified).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'contacts' && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-between p-4 border-b border-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">Contacts</h3>
                <Button size="sm" onClick={() => setShowContactModal(true)}>
                  <Plus size={13} /> Add Contact
                </Button>
              </div>
              <div className="divide-y divide-gray-50">
                {contacts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No contacts yet</p>
                ) : contacts.map(c => (
                  <div key={c.contactID} onClick={() => navigate(`/app/contacts/${c.contactID}`)}
                    className="flex items-center gap-3 p-4 hover:bg-amber-50 cursor-pointer transition-colors">
                    <Avatar name={c.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.position || 'No position'}</p>
                    </div>
                    <div className="text-right">
                      {c.email && <p className="text-xs text-amber-500">{c.email}</p>}
                      {c.phone && <p className="text-xs text-gray-400">{c.phone}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-between p-4 border-b border-gray-50">
                <h3 className="font-semibold text-gray-800 text-sm">Equipment</h3>
                <Button size="sm" onClick={() => setShowEquipmentModal(true)}>
                  <Plus size={13} /> Add Equipment
                </Button>
              </div>
              <div className="divide-y divide-gray-50">
                {equipment.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No equipment yet</p>
                ) : equipment.map(eq => (
                  <div key={eq.equipmentID} onClick={() => navigate(`/app/equipment/${eq.equipmentID}`)}
                    className="flex items-center gap-3 p-4 hover:bg-amber-50 cursor-pointer transition-colors">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Building2 size={15} className="text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{eq.name}</p>
                      <p className="text-xs text-gray-400">{eq.model} · {eq.year} · SN: {eq.serialNumber || '—'}</p>
                    </div>
                    <Badge variant="gray" size="sm">{eq.categoryName || 'Uncategorized'}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && <NotesPanel recordType="Company" recordId={companyId} />}
          {activeTab === 'tasks' && <TasksPanel recordType="Company" recordId={companyId} />}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Company"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button form="edit-company-form" type="submit" loading={updateCompany.isPending}>Save Changes</Button>
          </>
        }
      >
        <form id="edit-company-form" onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Company Name *" error={editForm.formState.errors.name?.message} {...editForm.register('name', { required: 'Required' })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...editForm.register('branchID', { valueAsNumber: true })}>
                <option value="">Select branch</option>
                {branches.map(b => <option key={b.branchID} value={b.branchID}>{b.name}</option>)}
              </select>
            </div>
            <Input label="Phone" {...editForm.register('phone')} />
            <Input label="Address" {...editForm.register('address1')} />
            <Input label="Address 2" {...editForm.register('address2')} />
            <Input label="City" {...editForm.register('city')} />
            <Input label="State" {...editForm.register('state')} />
            <Input label="ZIP" {...editForm.register('zip')} />
            <Input label="Country" {...editForm.register('country')} />
            <div className="col-span-2">
              <Input label="Website" {...editForm.register('website')} />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Company"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteCompany.isPending}>Yes, Delete</Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold text-base">Are you sure you want to delete this company?</p>
            <p className="text-gray-500 text-sm mt-1">
              <span className="font-medium text-gray-700">{company.name}</span> and all associated data will be permanently removed. This cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

      {/* Contact Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Add Contact"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowContactModal(false)}>Cancel</Button>
            <Button form="contact-form" type="submit" loading={createContact.isPending}>Add Contact</Button>
          </>
        }
      >
        <form id="contact-form" onSubmit={contactForm.handleSubmit(handleCreateContact)} className="space-y-3">
          <Input label="Full Name *" placeholder="Mike Tran" {...contactForm.register('name', { required: true })} />
          <Input label="Email" type="email" placeholder="mike@company.com" {...contactForm.register('email')} />
          <Input label="Phone" placeholder="(504) 555-0110" {...contactForm.register('phone')} />
          <Input label="Position" placeholder="Operations Manager" {...contactForm.register('position')} />
        </form>
      </Modal>

      {/* Equipment Modal */}
      <Modal isOpen={showEquipmentModal} onClose={() => setShowEquipmentModal(false)} title="Add Equipment" size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEquipmentModal(false)}>Cancel</Button>
            <Button form="equipment-form" type="submit" loading={createEquipment.isPending}>Add Equipment</Button>
          </>
        }
      >
        <form id="equipment-form" onSubmit={equipmentForm.handleSubmit(handleCreateEquipment)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Equipment Name *" placeholder="CAT D6T Dozer" {...equipmentForm.register('name', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...equipmentForm.register('categoryID', { valueAsNumber: true })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.categoryID} value={c.categoryID}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Model" placeholder="D6T" {...equipmentForm.register('model')} />
            <Input label="Serial Number" placeholder="CAT-2022-04412" {...equipmentForm.register('serialNumber')} />
            <Input label="Year" type="number" placeholder="2022" {...equipmentForm.register('year', { valueAsNumber: true })} />
            <div className="col-span-2">
              <Input label="Last Service Date" type="date" {...equipmentForm.register('lastServiceDate')} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CompanyDetailPage