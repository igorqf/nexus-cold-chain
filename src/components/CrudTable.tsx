'use client'

import { Plus, Edit2, Trash2 } from 'lucide-react'

interface Column {
  key: string
  label: string
  render?: (item: any) => React.ReactNode
}

interface CrudTableProps {
  title: string
  description: string
  data: any[]
  columns: Column[]
  onNew?: () => void
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
}

export default function CrudTable({ title, description, data, columns, onNew, onEdit, onDelete }: CrudTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Novo Registro
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-4">{col.label}</th>
              ))}
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {data.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(item) : item[col.key] || '-'}
                  </td>
                ))}
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => onEdit?.(item)} className="p-1.5 text-slate-400 hover:text-teal-600 transition-colors" title="Editar">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete?.(item)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">
                  Nenhum registro encontrado ou banco de dados vazio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
