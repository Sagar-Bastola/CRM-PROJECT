import React, { useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useEquipmentCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useEquipmentCategories'
import { CreateEquipmentCategoryDto, EquipmentCategory } from '../../types'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const EqCategoriesPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [editCat, setEditCat] = useState<EquipmentCategory | null>(null)

  const { data: categories = [], isLoading } = useEquipmentCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const { register, handleSubmit, reset, setValue } = useForm<CreateEquipmentCategoryDto>()

  const openEdit = (cat: EquipmentCategory) => {
    setEditCat(cat)
    setValue('name', cat.name)
    setShowModal(true)
  }

  const onSubmit = async (data: CreateEquipmentCategoryDto) => {
    if (editCat) {
      await updateCategory.mutateAsync({ id: editCat.categoryID, data })
    } else {
      await createCategory.mutateAsync(data)
    }
    reset()
    setEditCat(null)
    setShowModal(false)
  }

  if (isLoading) return <LoadingSpinner text="Loading categories..." />

  const colors = ['bg-amber-100 text-amber-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700', 'bg-red-100 text-red-700', 'bg-teal-100 text-teal-700']

  return (
    <div className="p-6">
      <PageHeader
        title="Equipment Categories"
        subtitle={`${categories.length} categories`}
        action={<Button onClick={() => { setEditCat(null); reset(); setShowModal(true) }}><Plus size={16} /> New Category</Button>}
      />

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Add equipment categories like Dozer, Excavator, Backhoe."
          action={{ label: '+ New Category', onClick: () => setShowModal(true) }}
          icon={<Tag size={28} />} />
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div key={cat.categoryID} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${colors[i % colors.length]}`}>
                  {cat.name}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteCategory.mutate(cat.categoryID)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400">Category ID: {cat.categoryID}</p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); setEditCat(null) }}
        title={editCat ? 'Edit Category' : 'New Category'}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset() }}>Cancel</Button>
            <Button form="cat-form" type="submit" loading={createCategory.isPending || updateCategory.isPending}>
              {editCat ? 'Update' : 'Create'} Category
            </Button>
          </>
        }
      >
        <form id="cat-form" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Category Name *" placeholder="Dozer, Excavator, Backhoe..." {...register('name', { required: true })} />
        </form>
      </Modal>
    </div>
  )
}

export default EqCategoriesPage