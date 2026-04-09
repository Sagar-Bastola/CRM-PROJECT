import React, { useState } from 'react'
import { Plus, Pencil, Trash2, GitBranch } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from '../../hooks/useBranches'
import { CreateBranchDto, UpdateBranchDto, Branch } from '../../types'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

const BranchesPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [editBranch, setEditBranch] = useState<Branch | null>(null)

  const { data: branches = [], isLoading } = useBranches()
  const createBranch = useCreateBranch()
  const updateBranch = useUpdateBranch()
  const deleteBranch = useDeleteBranch()

  const { register, handleSubmit, reset, setValue } = useForm<CreateBranchDto>()

  const openEdit = (branch: Branch) => {
    setEditBranch(branch)
    setValue('name', branch.name)
    setShowModal(true)
  }

  const onSubmit = async (data: CreateBranchDto) => {
    if (editBranch) {
      await updateBranch.mutateAsync({ id: editBranch.branchID, data: data as UpdateBranchDto })
    } else {
      await createBranch.mutateAsync(data)
    }
    reset()
    setEditBranch(null)
    setShowModal(false)
  }

  if (isLoading) return <LoadingSpinner text="Loading branches..." />

  return (
    <div className="p-6">
      <PageHeader
        title="Branches"
        subtitle={`${branches.length} locations`}
        action={<Button onClick={() => { setEditBranch(null); reset(); setShowModal(true) }}><Plus size={16} /> New Branch</Button>}
      />

      {branches.length === 0 ? (
        <EmptyState title="No branches yet" description="Add your dealership locations."
          action={{ label: '+ New Branch', onClick: () => setShowModal(true) }}
          icon={<GitBranch size={28} />} />
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {branches.map(branch => (
            <div key={branch.branchID} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <GitBranch size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                    <p className="text-xs text-gray-400">Branch ID: {branch.branchID}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(branch)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteBranch.mutate(branch.branchID)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); setEditBranch(null) }}
        title={editBranch ? 'Edit Branch' : 'New Branch'}
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset() }}>Cancel</Button>
            <Button form="branch-form" type="submit" loading={createBranch.isPending || updateBranch.isPending}>
              {editBranch ? 'Update' : 'Create'} Branch
            </Button>
          </>
        }
      >
        <form id="branch-form" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Branch Name *" placeholder="Baton Rouge" {...register('name', { required: true })} />
        </form>
      </Modal>
    </div>
  )
}

export default BranchesPage