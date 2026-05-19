'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormField, Select } from '@/components/ui/FormModal'
import { Eye, ShieldAlert, FileText, User } from 'lucide-react'

const initialMockLogs = [
  {
    id: 'log-1',
    user_email: 'igor.quadros@aguiabranca.com.br',
    action: 'UPDATE',
    resource: 'assets',
    ip_address: '177.85.12.94',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    created_at: '2026-05-19T14:20:00Z',
    old_data: JSON.stringify({ name: 'Caminhão Scania P320 Refr.', status: 'online' }),
    new_data: JSON.stringify({ name: 'Caminhão Scania P320 Refr.', status: 'in_operation' })
  },
  {
    id: 'log-2',
    user_email: 'igor.quadros@aguiabranca.com.br',
    action: 'CREATE',
    resource: 'users_profiles',
    ip_address: '177.85.12.94',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    created_at: '2026-05-19T14:10:00Z',
    old_data: null,
    new_data: JSON.stringify({ name: 'Operador Qualidade RJ', email: 'op.rj@nexusvital.com', role: 'operator' })
  },
  {
    id: 'log-3',
    user_email: 'supervisor.qualidade@nexusvital.com',
    action: 'DELETE',
    resource: 'alert_rules',
    ip_address: '200.141.200.41',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    created_at: '2026-05-19T11:45:00Z',
    old_data: JSON.stringify({ name: 'Alerta Temperatura Alta', threshold: 8.0, severity: 'warning' }),
    new_data: null
  }
]

export default function AuditLogsView() {
  const supabase = createClient()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Details Modal
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsItem, setDetailsItem] = useState<any>(null)

  // Filters
  const [filterAction, setFilterAction] = useState('')
  const [filterResource, setFilterResource] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setLogs(data && data.length ? data : initialMockLogs)
      } catch (err) {
        console.error(err)
        setLogs(initialMockLogs)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const columns = [
    { key: 'created_at', label: 'Data/Hora', sortable: true, render: (item: any) => new Date(item.created_at).toLocaleString() },
    { key: 'user_email', label: 'Usuário', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
        <User size={14} className="text-slate-400" />
        {item.user_email}
      </div>
    )},
    { key: 'action', label: 'Ação', sortable: true, render: (item: any) => (
      <span className={`font-bold text-xs px-2 py-0.5 rounded ${
        item.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
        item.action === 'UPDATE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
        'bg-red-50 text-red-700 border border-red-200'
      }`}>{item.action}</span>
    )},
    { key: 'resource', label: 'Tabela / Recurso', sortable: true, render: (item: any) => (
      <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">{item.resource}</code>
    )},
    { key: 'ip_address', label: 'IP de Origem', render: (item: any) => item.ip_address }
  ]

  const actions = [
    { label: 'Ver Payload Completo', icon: <Eye size={14} />, onClick: (item: any) => { setDetailsItem(item); setDetailsOpen(true) } }
  ]

  const filtered = logs.filter(l => {
    if (filterAction && l.action !== filterAction) return false
    if (filterResource && l.resource !== filterResource) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-150 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-teal-600" size={24} />
            Trilha de Auditoria e Logs (CFR Part 11)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Registro imutável de todas as ações de escrita, alterações de usuários e modificações de parâmetros GxP.</p>
        </div>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por usuário, ação, tabela..."
        searchKeys={['user_email', 'action', 'resource']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Ação">
              <Select value={filterAction} onChange={e => setFilterAction(e.target.value)}>
                <option value="">Todas</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
              </Select>
            </FormField>
            <FormField label="Tabela / Recurso">
              <Select value={filterResource} onChange={e => setFilterResource(e.target.value)}>
                <option value="">Todos</option>
                <option value="users_profiles">Usuários</option>
                <option value="assets">Ativos</option>
                <option value="alert_rules">Regras de Alerta</option>
                <option value="companies">Empresas</option>
              </Select>
            </FormField>
          </div>
        }
      />

      {/* Details View Modal */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Detalhamento Técnico de Transação Auditada"
        subtitle="Rastreabilidade regulatória completa de modificações."
        size="lg"
      >
        <div className="space-y-5 text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-medium">Metadados da Transação:</span>
              <span className="font-bold text-slate-800">{detailsItem?.action} em {detailsItem?.resource}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Data / Hora:</span>
              <span className="font-bold text-slate-800">{detailsItem ? new Date(detailsItem.created_at).toLocaleString() : ''}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">IP & Agente:</span>
              <span className="font-bold text-slate-800">{detailsItem?.ip_address}</span>
              <div className="text-[10px] text-slate-400 truncate max-w-[300px] mt-0.5" title={detailsItem?.user_agent}>
                {detailsItem?.user_agent}
              </div>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Usuário Responsável:</span>
              <span className="font-bold text-teal-700">{detailsItem?.user_email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                <FileText size={12} className="text-red-500" /> State Anterior (OLD Payload)
              </span>
              <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 overflow-x-auto max-h-[250px] leading-relaxed">
                {detailsItem?.old_data ? JSON.stringify(JSON.parse(detailsItem.old_data), null, 2) : '// Nenhum registro anterior (Operação de inserção)'}
              </pre>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                <FileText size={12} className="text-emerald-500" /> State Posterior (NEW Payload)
              </span>
              <pre className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-700 overflow-x-auto max-h-[250px] leading-relaxed">
                {detailsItem?.new_data ? JSON.stringify(JSON.parse(detailsItem.new_data), null, 2) : '// Nenhum registro posterior (Operação de deleção lógica)'}
              </pre>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
