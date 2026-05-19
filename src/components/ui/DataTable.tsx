'use client'

import React, { useState, useCallback } from 'react'
import { Search, Filter, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react'

export interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (item: T) => React.ReactNode
}

export interface RowAction<T = any> {
  label: string
  icon?: React.ReactNode
  onClick: (item: T) => void
  variant?: 'default' | 'danger'
  hidden?: (item: T) => boolean
}

interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  actions?: RowAction<T>[]
  searchPlaceholder?: string
  searchKeys?: string[]
  pageSize?: number
  emptyTitle?: string
  emptyDescription?: string
  loading?: boolean
  filters?: React.ReactNode
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  searchPlaceholder = 'Buscar...',
  searchKeys = ['name'],
  pageSize = 10,
  emptyTitle = 'Nenhum registro encontrado',
  emptyDescription = 'Tente ajustar os filtros ou cadastre um novo item.',
  loading = false,
  filters,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }, [sortKey])

  const filtered = data.filter(item => {
    if (!search) return true
    return searchKeys.some(k => {
      const val = k.split('.').reduce((o, p) => o?.[p], item)
      return String(val ?? '').toLowerCase().includes(search.toLowerCase())
    })
  })

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const av = String(a[sortKey] ?? '')
    const bv = String(b[sortKey] ?? '')
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-3">
      {/* Search + Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        {filters && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 text-sm border rounded-lg transition-colors ${showFilters ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Filter size={14} />
            Filtros
          </button>
        )}
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} registro(s)</span>
      </div>

      {showFilters && filters && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          {filters}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Carregando...</span>
          </div>
        ) : paged.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <div className="text-5xl">📭</div>
            <div className="text-center">
              <div className="font-semibold text-slate-600">{emptyTitle}</div>
              <div className="text-sm mt-1">{emptyDescription}</div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap ${col.sortable ? 'cursor-pointer select-none hover:text-slate-800' : ''} ${col.width || ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        {col.sortable && sortKey === col.key && (
                          sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && actions.length > 0 && (
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors group">
                    {columns.map(col => (
                      <td key={col.key} className="px-5 py-3.5 text-sm text-slate-700 max-w-[280px]">
                        {col.render ? col.render(item) : (
                          <span className="truncate block">{
                            col.key.includes('.') 
                              ? col.key.split('.').reduce((o: any, k) => o?.[k], item) ?? '—'
                              : item[col.key] ?? '—'
                          }</span>
                        )}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="px-5 py-3.5 text-right relative">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenMenu(openMenu === String(item.id || idx) ? null : String(item.id || idx))}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenu === String(item.id || idx) && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                              <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-xl border border-slate-200 py-1 min-w-[160px]">
                                {actions.filter(a => !a.hidden?.(item)).map((action, ai) => (
                                  <button
                                    key={ai}
                                    onClick={() => { action.onClick(item); setOpenMenu(null) }}
                                    className={`flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm transition-colors ${
                                      action.variant === 'danger' 
                                        ? 'text-red-600 hover:bg-red-50' 
                                        : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Página {page} de {totalPages} · {filtered.length} registros
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2
                if (p < 1 || p > totalPages) return null
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-teal-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
