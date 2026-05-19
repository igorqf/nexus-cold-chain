'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select, Textarea } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, AlertTriangle, ShieldCheck, Eye } from 'lucide-react'

const initialMockOccurrences = [
  {
    id: 'oc-1',
    title: 'Desvio Térmico Scania - Vacinas RJ',
    description: 'Temperatura subiu para 9.4°C por mais de 25 minutos durante o descarregamento na base Galeão.',
    severity: 'critical',
    asset_id: 'a-1',
    asset: { name: 'Caminhão Scania P320 Refr.' },
    route_id: 'rt-1',
    route: { name: 'Rota de Vacinas SP → RJ' },
    incident_date: '2026-05-19T10:15:00Z',
    action_taken: 'Veículo direcionado para doca refrigerada rápida. Acionada equipe de manutenção do isolamento.',
    operator_name: 'Roberto Souza',
    containment_report: 'Substituído relé auxiliar do termostato Thermo King. Lote de vacinas validado pelo controle de qualidade após análise de termolabilidade.',
    status: 'resolved'
  },
  {
    id: 'oc-2',
    title: 'Perda de Sinal IoT - Furgão BH',
    description: 'Sem atualizações de telemetria GPS/Temperatura por mais de 45 minutos em trânsito.',
    severity: 'warning',
    asset_id: 'a-3',
    asset: { name: 'Furgão Mercedes Sprinter' },
    route_id: 'rt-2',
    route: { name: 'Distribuição Local BH - Insulinas' },
    incident_date: '2026-05-19T09:00:00Z',
    action_taken: 'Contato telefônico realizado com motorista para confirmação de rota segura.',
    operator_name: 'Cláudio Ferreira',
    containment_report: '',
    status: 'pending'
  }
]

export default function OccurrencesCRUD() {
  const supabase = createClient()
  const [occurrences, setOccurrences] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsItem, setDetailsItem] = useState<any>(null)

  // Filters
  const [filterSeverity, setFilterSeverity] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'warning',
    asset_id: '',
    route_id: '',
    incident_date: '',
    action_taken: '',
    operator_name: '',
    containment_report: '',
    status: 'pending'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [oRes, aRes, rRes] = await Promise.all([
          supabase.from('occurrences').select('*, assets(name), route_operations(name)').is('deleted_at', null),
          supabase.from('assets').select('id, name').is('deleted_at', null),
          supabase.from('route_operations').select('id, name').is('deleted_at', null)
        ])

        const dbOccurrences = oRes.data || []
        const dbAssets = aRes.data || []
        const dbRoutes = rRes.data || []

        setAssets(dbAssets.length ? dbAssets : [{ id: 'a-1', name: 'Caminhão Scania P320 Refr.' }, { id: 'a-3', name: 'Furgão Mercedes Sprinter' }])
        setRoutes(dbRoutes.length ? dbRoutes : [{ id: 'rt-1', name: 'Rota de Vacinas SP → RJ' }, { id: 'rt-2', name: 'Distribuição Local BH - Insulinas' }])

        setOccurrences(dbOccurrences.length ? dbOccurrences : initialMockOccurrences)
      } catch (err) {
        console.error(err)
        setOccurrences(initialMockOccurrences)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Título do desvio é obrigatório'
    if (!formData.description.trim()) newErrors.description = 'Descrição do desvio é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      description: '',
      severity: 'warning',
      asset_id: assets[0]?.id || '',
      route_id: routes[0]?.id || '',
      incident_date: new Date().toISOString().slice(0, 16),
      action_taken: '',
      operator_name: '',
      containment_report: '',
      status: 'pending'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      title: item.title || '',
      description: item.description || '',
      severity: item.severity || 'warning',
      asset_id: item.asset_id || '',
      route_id: item.route_id || '',
      incident_date: item.incident_date ? new Date(item.incident_date).toISOString().slice(0, 16) : '',
      action_taken: item.action_taken || '',
      operator_name: item.operator_name || '',
      containment_report: item.containment_report || '',
      status: item.status || 'pending'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedAsset = assets.find(a => a.id === formData.asset_id)
    const selectedRoute = routes.find(r => r.id === formData.route_id)

    const payload = {
      ...formData,
      incident_date: formData.incident_date ? new Date(formData.incident_date).toISOString() : null,
      asset: selectedAsset ? { name: selectedAsset.name } : null,
      route: selectedRoute ? { name: selectedRoute.name } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setOccurrences(occurrences.map(o => o.id === editingItem.id ? { ...o, ...payload } : o))
      try {
        await supabase.from('occurrences').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        created_at: new Date().toISOString()
      }
      setOccurrences([newItem, ...occurrences])
      try {
        await supabase.from('occurrences').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setOccurrences(occurrences.map(o => o.id === deletingItem.id ? { ...o, status: 'resolved', deleted_at: new Date().toISOString() } : o))
    try {
      await supabase.from('occurrences').update({ status: 'resolved', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'title', label: 'Desvio / Não Conformidade', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <AlertTriangle size={16} className={item.severity === 'critical' ? 'text-red-500 animate-bounce' : 'text-amber-500'} />
        <div>
          <div>{item.title}</div>
          <div className="text-[10px] text-slate-400 font-normal">{item.route?.name || 'Sem Rota Vinculada'}</div>
        </div>
      </div>
    )},
    { key: 'asset.name', label: 'Ativo', render: (item: any) => item.asset?.name || '—' },
    { key: 'incident_date', label: 'Data Ocorrência', render: (item: any) => item.incident_date ? new Date(item.incident_date).toLocaleString() : '—' },
    { key: 'action_taken', label: 'Ação Imediata', render: (item: any) => <span className="max-w-[200px] block truncate text-xs text-slate-600 font-medium">{item.action_taken || 'Nenhuma'}</span> },
    { key: 'severity', label: 'Severidade', render: (item: any) => <StatusBadge value={item.severity} /> },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Ver Laudo Completo', icon: <Eye size={14} />, onClick: (item: any) => { setDetailsItem(item); setDetailsOpen(true) } },
    { label: 'Tratar e Editar', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    {
      label: 'Marcar Resolvido',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'resolved'
    }
  ]

  const filtered = occurrences.filter(o => {
    if (filterSeverity && o.severity !== filterSeverity) return false
    if (filterStatus && o.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registro de Ocorrências e Não Conformidades</h2>
          <p className="text-sm text-slate-500 mt-1">Gestão regulatória GxP para tratamento de desvios térmicos e perda de carga.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Ocorrência
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por título, descrição..."
        searchKeys={['title', 'description']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Severidade">
              <Select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
                <option value="">Todas</option>
                <option value="critical">Crítico</option>
                <option value="warning">Atenção</option>
                <option value="info">Info</option>
              </Select>
            </FormField>
            <FormField label="Status Tratativa">
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="pending">Aberto / Pendente</option>
                <option value="resolved">Resolvido / Tratado</option>
              </Select>
            </FormField>
          </div>
        }
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Tratar Ocorrência' : 'Novo Registro de Ocorrência'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Origem do Incidente">
          <FormRow>
            <FormField label="Título Curto do Desvio" required error={errors.title}>
              <Input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Excesso de temperatura Scania"
              />
            </FormField>
            <FormField label="Gravidade do Evento">
              <Select value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value })}>
                <option value="critical">Crítico (Bloqueio de Lote)</option>
                <option value="warning">Atenção (Margem de Alerta)</option>
                <option value="info">Informativo</option>
              </Select>
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Ativo Relacionado">
              <Select value={formData.asset_id} onChange={e => setFormData({ ...formData, asset_id: e.target.value })}>
                <option value="">Selecione o ativo...</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Rota Operacional Relacionada">
              <Select value={formData.route_id} onChange={e => setFormData({ ...formData, route_id: e.target.value })}>
                <option value="">Selecione a rota...</option>
                {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Data/Hora do Incidente">
              <Input
                type="datetime-local"
                value={formData.incident_date}
                onChange={e => setFormData({ ...formData, incident_date: e.target.value })}
              />
            </FormField>
            <FormField label="Status Tratativa">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="pending">Aberto / Em Análise</option>
                <option value="resolved">Tratado / Resolvido</option>
              </Select>
            </FormField>
          </FormRow>
          <FormField label="Descrição da Ocorrência" required error={errors.description}>
            <Textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Descreva minuciosamente o desvio..."
            />
          </FormField>
        </FormSection>

        <FormSection title="Ação de Resolução e Contenção GxP">
          <FormRow>
            <FormField label="Ação Imediata Tomada">
              <Input
                value={formData.action_taken}
                onChange={e => setFormData({ ...formData, action_taken: e.target.value })}
                placeholder="Ex: Direcionado para doca climatizada."
              />
            </FormField>
            <FormField label="Responsável Técnico Operador">
              <Input
                value={formData.operator_name}
                onChange={e => setFormData({ ...formData, operator_name: e.target.value })}
                placeholder="Nome do operador que atendeu"
              />
            </FormField>
          </FormRow>
          <FormField label="Laudo Técnico / Medida Corretiva Final">
            <Textarea
              value={formData.containment_report}
              onChange={e => setFormData({ ...formData, containment_report: e.target.value })}
              rows={3}
              placeholder="Descreva o laudo de qualidade dos imunobiológicos e ações tomadas para evitar novos desvios."
            />
          </FormField>
        </FormSection>
      </FormModal>

      {/* Confirm Resolve Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Resolver Ocorrência"
        description={`Tem certeza que deseja marcar "${deletingItem?.title}" como Resolvido/Tratado? Esta ação exige laudo de qualidade subsequente.`}
      />

      {/* Details View */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Relatório de Tratativa de Não Conformidade`}
        subtitle="Registro GxP auditável para vigilância sanitária."
      >
        <div className="space-y-6 text-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <ShieldCheck size={20} className="text-teal-600" />
            <div>
              <h4 className="font-bold text-slate-800">{detailsItem?.title}</h4>
              <span className="text-xs text-slate-400">ID Ocorrência: {detailsItem?.id} · {detailsItem?.incident_date ? new Date(detailsItem.incident_date).toLocaleString() : ''}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="block text-slate-400 font-bold text-xs">Descrição do Desvio:</span>
              <p className="text-slate-700 bg-slate-50 border border-slate-150 p-3 rounded-lg leading-relaxed mt-1 text-xs">{detailsItem?.description}</p>
            </div>
            <div>
              <span className="block text-slate-400 font-bold text-xs">Ação Imediata de Contenção:</span>
              <p className="text-slate-700 bg-slate-50 border border-slate-150 p-3 rounded-lg leading-relaxed mt-1 text-xs">{detailsItem?.action_taken || 'Não registrada'}</p>
            </div>
            <div>
              <span className="block text-slate-400 font-bold text-xs">Laudo Metrológico / Qualidade:</span>
              <p className="text-teal-900 bg-teal-50/50 border border-teal-150 p-3 rounded-lg leading-relaxed mt-1 text-xs font-semibold">
                {detailsItem?.containment_report || 'Aguardando parecer final do gestor de garantia de qualidade.'}
              </p>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
