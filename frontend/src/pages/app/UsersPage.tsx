import React, { useState } from 'react'
import { Shield, Trash2, Edit, AlertTriangle } from 'lucide-react'
import { useUsers, useUpdateUser, useDeleteUser } from '../../hooks/useUsers'
import { UpdateUserDto, User } from '../../types'
import { useForm } from 'react-hook-form'
import DataTable, { Column } from '../../components/shared/DataTable'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Badge, { getStatusBadge } from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import PageHeader from '../../components/shared/PageHeader'

const ROLES = ['Admin', 'User']

const UsersPage: React.FC = () => {
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser_target, setDeleteUserTarget] = useState<User | null>(null)
  const { data: users = [], isLoading } = useUsers()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const { register, handleSubmit, reset, setValue } = useForm<UpdateUserDto>()

  const openEdit = (user: User) => {
    setEditUser(user)
    setValue('username', user.username)
    setValue('email', user.email)
    setValue('role', user.role)
  }

  const onSubmit = async (data: UpdateUserDto) => {
    if (!editUser) return
    await updateUser.mutateAsync({ id: editUser.userID, data })
    setEditUser(null)
    reset()
  }

  const handleDelete = async () => {
    if (!deleteUser_target) return
    await deleteUser.mutateAsync(deleteUser_target.userID)
    setDeleteUserTarget(null)
  }

  const columns: Column<User>[] = [
    {
      key: 'username', label: 'User', sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.username} size="sm" />
          <div>
            <p className="font-medium text-gray-900 text-sm">{row.username}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', render: (v) => <Badge variant={getStatusBadge(v)}><Shield size={11} className="inline mr-1" />{v}</Badge> },
    { key: 'createdAt', label: 'Joined', render: (v) => <span className="text-xs text-gray-400">{new Date(v).toLocaleDateString()}</span> },
    {
      key: 'actions', label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); openEdit(row) }}><Edit size={13} /></Button>
          <Button size="sm" variant="danger" onClick={e => { e.stopPropagation(); setDeleteUserTarget(row) }}><Trash2 size={13} /></Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <PageHeader title="Users" subtitle={`${users.length} system users`} />

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        keyExtractor={row => row.userID}
        searchPlaceholder="Search users..."
        emptyTitle="No users found"
      />

      {/* Edit Modal */}
      <Modal isOpen={!!editUser} onClose={() => { setEditUser(null); reset() }} title="Edit User"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setEditUser(null); reset() }}>Cancel</Button>
            <Button form="user-form" type="submit" loading={updateUser.isPending}>Save Changes</Button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input label="Username" {...register('username')} />
          <Input label="Email" type="email" {...register('email')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('role')}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <Input label="New Password (leave blank to keep)" type="password" placeholder="••••••••" {...register('password')} />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteUser_target}
        onClose={() => setDeleteUserTarget(null)}
        title="Delete User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteUserTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteUser.isPending}>Yes, Delete</Button>
          </>
        }
      >
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-800 font-semibold text-base">Are you sure you want to delete this user?</p>
            <p className="text-gray-500 text-sm mt-1">
              <span className="font-medium text-gray-700">{deleteUser_target?.username}</span> will be permanently removed. This cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UsersPage