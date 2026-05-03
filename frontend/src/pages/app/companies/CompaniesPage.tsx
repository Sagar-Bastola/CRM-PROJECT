import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Phone, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useCompanies, useCreateCompany } from '../../../hooks/useCompanies'
import { useBranches } from '../../../hooks/useBranches'
import { CreateCompanyDto } from '../../../types'
import DataTable, { Column } from '../../../components/shared/DataTable'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Input from '../../../components/ui/Input'
import Avatar from '../../../components/ui/Avatar'
import Badge from '../../../components/ui/Badge'
import PageHeader from '../../../components/shared/PageHeader'

const CompaniesPage: React.FC = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const { data: companies = [], isLoading } = useCompanies()
  const { data: branches = [] } = useBranches()
  const createCompany = useCreateCompany()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCompanyDto>()

  const onSubmit = async (data: CreateCompanyDto) => {
    await createCompany.mutateAsync(data)
    reset()
    setShowModal(false)
  }

  const columns: Column<typeof companies[0]>[] = [
    {
      key: 'name', label: 'Company', sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-gray-900 text-sm">{row.name}</p>
            {row.website && <p className="text-xs text-amber-500">{row.website}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'branchName', label: 'Branch',
      render: (v) => v ? <Badge variant="blue">{v}</Badge> : <span className="text-gray-400 text-xs">—</span>,
    },
    {
      key: 'city', label: 'Location',
      render: (_, row) => row.city ? (
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin size={13} className="text-gray-400" />
          {row.city}{row.state ? `, ${row.state}` : ''}
        </div>
      ) : <span className="text-gray-400 text-xs">—</span>,
    },
    {
      key: 'phone', label: 'Phone',
      render: (v) => v ? (
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <Phone size={13} className="text-gray-400" />{v}
        </div>
      ) : <span className="text-gray-400 text-xs">—</span>,
    },
    {
      key: 'createdAt', label: 'Created', sortable: true,
      render: (v) => <span className="text-xs text-gray-400">{new Date(v).toLocaleDateString()}</span>,
    },
  ]

  return (
    <div className="p-6">
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} total accounts`}
        action={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Company
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={companies}
        isLoading={isLoading}
        onRowClick={row => navigate(`/app/companies/${row.companyID}`)}
        keyExtractor={row => row.companyID}
        searchPlaceholder="Search companies..."
        emptyTitle="No companies yet"
        emptyDescription="Add your first customer company to get started."
        emptyAction={{ label: '+ New Company', onClick: () => setShowModal(true) }}
      />

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); reset() }}
        title="New Company"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowModal(false); reset() }}>Cancel</Button>
            <Button form="company-form" type="submit" loading={createCompany.isPending}>Create Company</Button>
          </>
        }
      >
        <form id="company-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Company Name *" placeholder="Gulf Coast Construction" error={errors.name?.message} {...register('name', { required: 'Required' })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" {...register('branchID', { valueAsNumber: true })}>
                <option value="">Select branch</option>
                {branches.map(b => <option key={b.branchID} value={b.branchID}>{b.name}</option>)}
              </select>
            </div>
            <Input label="Phone" placeholder="(504) 555-0110" {...register('phone')} />
            <Input label="Address" placeholder="123 Main St" {...register('address1')} />
            <Input label="Address 2" placeholder="Suite 100" {...register('address2')} />
            <Input label="City" placeholder="New Orleans" {...register('city')} />
            <Input label="State" placeholder="LA" {...register('state')} />
            <Input label="ZIP" placeholder="70112" {...register('zip')} />
            <Input label="Country" placeholder="USA" {...register('country')} />
            <div className="col-span-2">
              <Input label="Website" placeholder="https://company.com" {...register('website')} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CompaniesPage