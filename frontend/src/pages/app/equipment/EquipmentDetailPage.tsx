import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Truck, Tag, Calendar, Hash, Trash2, Building2 } from 'lucide-react'
import { useEquipmentById, useDeleteEquipment } from '../../../hooks/useEquipment'
import NotesPanel from '../../../components/shared/NotesPanel'
import TasksPanel from '../../../components/shared/TasksPanel'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import LoadingSpinner from '../../../components/shared/LoadingSpinner'

const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const equipmentId = Number(id)
  const { data: equipment, isLoading } = useEquipmentById(equipmentId)
  const deleteEquipment = useDeleteEquipment()
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes')

  const handleDelete = async () => {
    if (!confirm('Delete this equipment record?')) return
    await deleteEquipment.mutateAsync(equipmentId)
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
        <Button variant="danger" size="sm" onClick={handleDelete}>
          <Trash2 size={14} /> Delete
        </Button>
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
          {activeTab === 'notes' && <NotesPanel recordType="Equipment" recordId={equipmentId} />}
          {activeTab === 'tasks' && <TasksPanel recordType="Equipment" recordId={equipmentId} />}
        </div>
      </div>
    </div>
  )
}

export default EquipmentDetailPage