import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck, Tag, Calendar, Hash, Trash2, Building2, Edit, AlertTriangle } from 'lucide-react'
import { useEquipmentById, useDeleteEquipment, useUpdateEquipment } from '../../../hooks/useEquipment'
import { useCompanies } from '../../../hooks/useCompanies'
import { useEquipmentCategories } from '../../../hooks/useEquipmentCategories'
import { UpdateEquipmentDto } from '../../../types'
import { useForm } from 'react-hook-form'
import NotesPanel from '../../../components/shared/NotesPanel'
import TasksPanel from '../../../components/shared/TasksPanel'
import ServiceHistoryPanel from '../../../components/shared/ServiceHistoryPanel'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import LoadingSpinner from '../../../components/shared/LoadingSpinner'

const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const equipmentId = Number(id)

  const { data: equipment, isLoading } = useEquipmentById(equipmentId)
  const { data: companies = [] } = useCompanies()
  const { data: categories = [] } = useEquipmentCategories()
  const deleteEquipment = useDeleteEquipment()
  const updateEquipment = useUpdateEquipment()

  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'service'>('notes')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const editForm = useForm<UpdateEquipmentDto>()

  const handleEditOpen = () => {
    if (!equipment) return
    editForm.reset({
      name: equipment.name,
      model: equipment.model ?? '',
      serialNumber: equipment.serialNumber ?? '',
      year: equipment.year,
      lastServiceDate: equipment.lastServiceDate
        ? new Date(equipment.lastServiceDate).toISOString().split('T')[0]
        : '',
      categoryID: equipment.categoryID,
      companyID: equipment.companyID,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (data: UpdateEquipmentDto) => {
    await updateEquipment.mutateAsync({ id: equipmentId, data })
    setShowEditModal(false)
  }

  const handleDelete = async () => {
    await deleteEquipment.mutateAsync(equipmentId)
    setShowDeleteModal(false)
    navigate('/app/equipment')
  }

  if (isLoading) return <LoadingSpinner text="Loading equipment..." />
  if (!equipment) return <div className="p-6 text-gray-500">Equipment not found.</div>

  const daysSinceService = equipment.lastServiceDate
    ? Math.floor((new Date().getTime() - new Date(equipment.lastServiceDate).getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/app/equipment')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <Truck size={22} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{equipment.name}</h1>
          <p className="text-sm text-gray-500">{equipment.model} · {equipment.year}</p>
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
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            <h2 className="font-semibold text-gray-800 text-sm border-b border-gray-50 pb-2">Equipment Details</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag size={14} className="text-gray-400" />
              <span className="text-gray-500">Category:</span>
              <Badge variant="gray">{equipment.categoryName || 'Uncategorized'}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 size={14} className="text-gray-400" />
              <span className="text-gray-500">Company:</span>
              <button onClick={() => navigate(`/app/companies/${equipment.companyID}`)} className="text-amber-500 hover:underline font-medium">
                {equipment.companyName}
              </button>
            </div>
            {equipment.serialNumber && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Hash size={14} className="text-gray-400" />
                <span className="text-gray-500">Serial:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{equipment.serialNumber}</span>
              </div>
            )}
            {equipment.lastServiceDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-gray-500">Last service:</span>
                <span className={`font-medium ${daysSinceService && daysSinceService > 180 ? 'text-amber-600' : 'text-gray-700'}`}>
                  {new Date(equipment.lastServiceDate).toLocaleDateString()}
                  {daysSinceService !== null && ` (${daysSinceService}d ago)`}
                </span>
              </div>
            )}
            {daysSinceService && daysSinceService > 180 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">⚠ PM service recommended</p>
              </div>
            )}
            <div className="pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-400">Added: {new Date(equipment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {['notes', 'tasks', 'service'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all capitalize ${
                  activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === 'notes' && <NotesPanel recordType="Equipment" recordId={equipmentId} />}
          {activeTab === 'tasks' && <TasksPanel recordType="Equipment" recordId={equipmentId} />}
          {activeTab === 'service' && <ServiceHistoryPanel equipmentId={equipmentId} />}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Equipment"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button form="edit-equipment-form" type="submit" loading={updateEquipment.isPending}>Save Changes</Button>
          </>
        }
      >
        <form id="edit-equipment-form" onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Equipment Name *" error={editForm.formState.errors.name?.message} {...editForm.register('name', { required: 'Required' })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...editForm.register('companyID', { valueAsNumber: true })}>
                <option value="">Select company</option>
                {companies.map(c => <option key={c.companyID} value={c.companyID}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...editForm.register('categoryID', { valueAsNumber: true })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.categoryID} value={c.categoryID}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Model" {...editForm.register('model')} />
            <Input label="Serial Number" {...editForm.register('serialNumber')} />
            <Input label="Year" type="number" {...editForm.register('year', { valueAsNumber: true })} />
            <div className="col-span-2">
              <Input label="Last Service Date" type="date" {...editForm.register('lastServiceDate')} />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Equipment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteEquipment.isPending}>Yes, Delete</Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold text-base">Are you sure you want to delete this equipment?</p>
            <p className="text-gray-500 text-sm mt-1">
              <span className="font-medium text-gray-700">{equipment.name}</span> will be permanently removed. This cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EquipmentDetailPage