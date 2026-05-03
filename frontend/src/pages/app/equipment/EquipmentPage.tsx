import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Truck, AlertTriangle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useEquipment, useCreateEquipment } from '../../../hooks/useEquipment'
import { useCompanies } from '../../../hooks/useCompanies'
import { useEquipmentCategories } from '../../../hooks/useEquipmentCategories'
import { CreateEquipmentDto } from '../../../types'
import DataTable, { Column } from '../../../components/shared/DataTable'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Badge from '../../../components/ui/Badge'
import PageHeader from '../../../components/shared/PageHeader'

const EquipmentPage: React.FC = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const { data: equipment = [], isLoading } = useEquipment()
  const { data: companies = [] } = useCompanies()
  const { data: categories = [] } = useEquipmentCategories()
  const createEquipment = useCreateEquipment()
  const { register, handleSubmit, reset } = useForm<CreateEquipmentDto>()

  const pmDueCount = equipment.filter(e => {
    if (!e.lastServiceDate) return false
    const days = (new Date().getTime() - new Date(e.lastServiceDate).getTime()) / (1000 * 60 * 60 * 24)
    return days > 180
  }).length

  const onSubmit = async (data: CreateEquipmentDto) => {
    await createEquipment.mutateAsync(data)
    reset()
    setShowModal(false)
  }

  const columns: Column<typeof equipment[0]>[] = [
    {
      key: 'name', label: 'Equipment', sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck size={16} className="text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{row.name}</p>
            <p className="text-xs text-gray-400">SN: {row.serialNumber || '—'}</p>
          </div>
        </div>
      ),
    },
    { key: 'categoryName', label: 'Category', render: (v) => v ? <Badge variant="gray">{v}</Badge> : <span className="text-gray-400 text-xs">—</span> },
    { key: 'companyName', label: 'Company', sortable: true, render: (v) => <span className="text-sm text-amber-600 font-medium">{v || '—'}</span> },
    { key: 'model', label: 'Model', render: (v) => <span className="text-sm text-gray-600">{v || '—'}</span> },
    { key: 'year', label: 'Year', render: (v) => <span className="text-sm text-gray-600">{v || '—'}</span> },
    {
      key: 'lastServiceDate', label: 'Last Service',
      render: (v) => {
        if (!v) return <span className="text-gray-400 text-xs">No service record</span>
        const days = Math.floor((new Date().getTime() - new Date(v).getTime()) / (1000 * 60 * 60 * 24))
        return (
          <div className="flex items-center gap-1.5">
            {days > 180 && <AlertTriangle size={13} className="text-amber-500" />}
            <span className={`text-xs ${days > 180 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
              {new Date(v).toLocaleDateString()}
            </span>
          </div>
        )
      },
    },
  ]

  return (
    <div className="p-6">
      <PageHeader
        title="Equipment Fleet"
        subtitle={`${equipment.length} machines tracked${pmDueCount > 0 ? ` · ${pmDueCount} PM overdue` : ''}`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Equipment</Button>}
      />

      {pmDueCount > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-700 text-sm">
          <AlertTriangle size={16} />
          <strong>{pmDueCount} machines</strong> haven't been serviced in over 6 months and may need attention.
        </div>
      )}

      <DataTable
        columns={columns}
        data={equipment}
        isLoading={isLoading}
        onRowClick={row => navigate(`/app/equipment/${row.equipmentID}`)}
        keyExtractor={row => row.equipmentID}
        searchPlaceholder="Search by name, serial, company..."
        emptyTitle="No equipment yet"
        emptyDescription="Add your first machine to start tracking your fleet."
        emptyAction={{ label: '+ Add Equipment', onClick: () => setShowModal(true) }}
      />

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset() }} title="Add Equipment" size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset() }}>Cancel</Button>
            <Button form="equipment-form" type="submit" loading={createEquipment.isPending}>Add Equipment</Button>
          </>
        }
      >
        <form id="equipment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Equipment Name *" placeholder="CAT D6T Dozer" {...register('name', { required: true })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('companyID', { required: true, valueAsNumber: true })}>
                <option value="">Select company</option>
                {companies.map(c => <option key={c.companyID} value={c.companyID}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('categoryID', { valueAsNumber: true })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.categoryID} value={c.categoryID}>{c.name}</option>)}
              </select>
            </div>
            <Input label="Model" placeholder="D6T" {...register('model')} />
            <Input label="Serial Number" placeholder="CAT-2022-04412" {...register('serialNumber')} />
            <Input label="Year" type="number" placeholder="2022" {...register('year', { valueAsNumber: true })} />
            <div className="col-span-2">
              <Input label="Last Service Date" type="date" {...register('lastServiceDate')} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default EquipmentPage