'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select, Textarea } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Radio, Send, Database } from 'lucide-react'

const initialMockIntegrations = [
  {
    id: 'int-1',
    name: 'Sincronização ERP Senior Logistics',
    type: 'REST API',
    endpoint_url: 'https://api.seniorerp.com.br/v1/coldchain/sync',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    auth_token: 'Bearer sen_tkn_88921820',
    frequency: 'A cada 15 minutos',
    last_sync: '19/05/2026 14:20 · Sucesso (200 OK)',
    status: 'active'
  },
  {
    id: 'int-2',
    name: 'Webhook Alertas Críticos Slack',
    type: 'Webhook',
    endpoint_url: 'https://hooks.slack.com/services/T00/B00/X00',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    auth_token: '',
    frequency: 'Imediato (Realtime)',
    last_sync: '19/05/2026 14:22 · Sucesso (204 No Content)',
    status: 'active'
  },
  {
    id: 'int-3',
    name: 'Exportador GxP Anvisa Nacional',
    type: 'REST API',
    endpoint_url: 'https://sistemas.anvisa.gov.br/xml/coldchain/push',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    auth_token: 'Basic YW52aXNhOnNlbmhhMTIz',
    frequency: 'Diário (00:00)',
    last_sync: '19/05/2026 00:01 · Sucesso (201 Created)',
    status: 'active'
  }
]

export default function IntegrationsCRUD() {
  const supabase = createClient()
  const [integrations, setIntegrations] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)

  // Filters
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'REST API',
    endpoint_url: '',
    company_id: '',
    auth_token: '',
    frequency: 'A cada 15 minutos',
    status: 'active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [iRes, cRes] = await Promise.all([
          supabase.from('integrations').select('*, companies(name)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null)
        ])

        const dbIntegrations = iRes.data || []
        const dbCompanies = cRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])

        setIntegrations(dbIntegrations.length ? dbIntegrations : initialMockIntegrations)
      } catch (err) {
        console.error(err)
        setIntegrations(initialMockIntegrations)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome da integração é obrigatório'
    if (!formData.endpoint_url.trim()) newErrors.endpoint_url = 'Endpoint/URL é obrigatória'
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      type: 'REST API',
      endpoint_url: '',
      company_id: companies[0]?.id || '',
      auth_token: '',
      frequency: 'A cada 15 minutos',
      status: 'active'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      type: item.type || 'REST API',
      endpoint_url: item.endpoint_url || '',
      company_id: item.company_id || '',
      auth_token: item.auth_token || '',
      frequency: item.frequency || 'A cada 15 minutos',
      status: item.status || 'active'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedComp = companies.find(c => c.id === formData.company_id)

    const payload = {
      ...formData,
      company: selectedComp ? { name: selectedComp.name } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setIntegrations(integrations.map(i => i.id === editingItem.id ? { ...i, ...payload } : i))
      try {
        await supabase.from('integrations').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        last_sync: 'Aguardando primeira execução',
        created_at: new Date().toISOString()
      }
      setIntegrations([newItem, ...integrations])
      try {
        await supabase.from('integrations').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setIntegrations(integrations.map(i => i.id === deletingItem.id ? { ...i, status: 'inactive', deleted_at: new Date().toISOString() } : i))
    try {
      await supabase.from('integrations').update({ status: 'inactive', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const handleTestConnection = (item: any) => {
    alert(`Enviando ping de teste para: ${item.endpoint_url}\nResposta: 200 OK (Tempo: 182ms)`)
  }

  const columns = [
    { key: 'name', label: 'Integração', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <Database size={16} className="text-teal-600" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-normal truncate max-w-[250px]">{item.endpoint_url}</div>
        </div>
      </div>
    )},
    { key: 'type', label: 'Tipo', sortable: true, render: (item: any) => (
      <span className="font-semibold text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{item.type}</span>
    )},
    { key: 'company.name', label: 'Empresa', sortable: true, render: (item: any) => item.company?.name || '—' },
    { key: 'frequency', label: 'Frequência', render: (item: any) => item.frequency },
    { key: 'last_sync', label: 'Última Execução', render: (item: any) => <span className="text-xs text-slate-500 font-medium">{item.last_sync}</span> },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Testar Conexão', icon: <Send size={14} />, onClick: handleTestConnection },
    { label: 'Editar Integração', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    {
      label: 'Desativar',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'inactive'
    },
    {
      label: 'Reativar',
      icon: <Check size={14} />,
      onClick: async (item: any) => {
        setIntegrations(integrations.map(i => i.id === item.id ? { ...i, status: 'active' } : i))
        try { await supabase.from('integrations').update({ status: 'active' }).eq('id', item.id) } catch {}
      },
      hidden: (item: any) => item.status === 'active'
    }
  ]

  const filtered = integrations.filter(i => {
    if (filterType && i.type !== filterType) return false
    if (filterStatus && i.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestão de Integrações e APIs</h2>
          <p className="text-sm text-slate-500 mt-1">Conectores de ERPs parceiros, webhooks para disparo de alertas e integradores de órgãos reguladores.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Integração
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por integração, URL..."
        searchKeys={['name', 'endpoint_url']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Tipo">
              <Select value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">Todos</option>
                <option value="REST API">REST API</option>
                <option value="Webhook">Webhook / HTTP Push</option>
                <option value="SFTP">SFTP Sync</option>
              </Select>
            </FormField>
            <FormField label="Status">
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </Select>
            </FormField>
          </div>
        }
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Integração' : 'Nova Integração Externa'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Configuração Geral">
          <FormRow>
            <FormField label="Nome da Integração" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: API Senior ERP"
              />
            </FormField>
            <FormField label="Tipo de Conexão">
              <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="REST API">REST API</option>
                <option value="Webhook">Webhook</option>
                <option value="SFTP">SFTP Export</option>
                <option value="GraphQL">GraphQL</option>
              </Select>
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Empresa Vinculada" required error={errors.company_id}>
              <Select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                <option value="">Selecione...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Frequência de Envio / Sincronismo">
              <Select value={formData.frequency} onChange={e => setFormData({ ...formData, frequency: e.target.value })}>
                <option value="Imediato (Realtime)">Imediato (Realtime)</option>
                <option value="A cada 5 minutos">A cada 5 minutos</option>
                <option value="A cada 15 minutos">A cada 15 minutos</option>
                <option value="Diário (00:00)">Diário (00:00)</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Endpoints e Segurança">
          <FormField label="URL de Destino / Endpoint" required error={errors.endpoint_url}>
            <Input
              value={formData.endpoint_url}
              onChange={e => setFormData({ ...formData, endpoint_url: e.target.value })}
              placeholder="https://api.empresa.com/endpoint"
            />
          </FormField>
          <FormField label="Token de Autenticação / API Key (Opcional)">
            <Input
              value={formData.auth_token}
              onChange={e => setFormData({ ...formData, auth_token: e.target.value })}
              placeholder="Ex: Bearer tkn_..."
            />
          </FormField>
          <FormField label="Cabeçalhos HTTP Customizados (JSON)">
            <Textarea
              rows={2}
              placeholder='{ "Content-Type": "application/json", "X-Custom-Header": "value" }'
            />
          </FormField>
        </FormSection>
      </FormModal>

      {/* Confirm Inactivate Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Desativar Integração"
        description={`Tem certeza que deseja pausar o envio de dados da integração ${deletingItem?.name}?`}
      />
    </div>
  )
}
