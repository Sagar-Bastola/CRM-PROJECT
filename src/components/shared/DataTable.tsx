import React, { useState } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'

export interface Column<T> {
  key: string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  searchable?: boolean
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: { label: string; onClick: () => void }
  keyExtractor: (row: T) => string | number
}

function DataTable<T extends Record<string, any>>({
  columns, data, isLoading, onRowClick, searchable = true,
  searchPlaceholder = 'Search...', emptyTitle = 'No records found',
  emptyDescription, emptyAction, keyExtractor,
}: Props<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = data.filter(row =>
    Object.values(row).some(v =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    )
  )

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        const cmp = String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filtered

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  if (isLoading) return <LoadingSpinner text="Loading..." />

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      {searchable && (
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.width || ''} ${col.sortable ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
                </td>
              </tr>
            ) : (
              sorted.map(row => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'cursor-pointer hover:bg-amber-50' : 'hover:bg-gray-50'} transition-colors`}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3.5 text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {sorted.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
          {sorted.length} of {data.length} records
        </div>
      )}
    </div>
  )
}

export default DataTable