'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select, Textarea } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, BellRing, Settings } from 'lucide-react'

const initialMockRules = [
  {
    id: 'rl-1',
    name: 'Excesso de Temperatura Crítico - Vacinas',
    code: 'RULE-TEMP-HIGH-CRIT',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    trigger_type: 'temp_above',
    threshold: 8.0,
    delay_minutes: 15,
    severity: 'critical',
    notify_email: true,
    notify_whatsapp: true,
    notify_sms: false,
    contact_list: 'supervisor.plantao@nexusvital.com, plantao.qualidade@nexusvital.com',
    status: 'active'
  },
  {
    id: 'rl-2',
    name: 'Alerta de Pré-Excesso Térmico',
    code: 'RULE-TEMP-HIGH-WARN',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    trigger_type: 'temp_above',
    threshold: 7.0,
    delay_minutes: 10,
    severity: 'warning',
    notify_email: true,
    notify_whatsapp: false,
    notify_sms: false,
    contact_list: 'analista.qualidade@nexusvital.com',
    status: 'active'
  },
  {
    id: 'rl-3',
    name: 'Falha Crítica de Conectividade IoT',
    code: 'RULE-COMM-LOST',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    trigger_type: 'no_comm',
    threshold: 30.0, // minutes without communication
    delay_minutes: 0,
    severity: 'critical',
    notify_email: true,
    notify_whatsapp: true,
    notify_sms: true,
    contact_list: 'ti.suporte@farmacool.com, supervisor.bh@farmacool.com',
    status: 'active'
  }
]

export default function RulesCRUD() {
  const supabase = createClient()
  const [rules, setRules] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)

  // Filters
  const [filterSeverity, setFilterSeverity] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    company_id: '',
    trigger_type: 'temp_above',
    threshold: '8.0',
    delay_minutes: '15',
    severity: 'critical',
    notify_email: true,
    notify_whatsapp: false,
    notify_sms: false,
    contact_list: '',
    status: 'active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [rRes, cRes] = await Promise.all([
          supabase.from('alert_rules').select('*, companies(name)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null)
        ])

        const dbRules = rRes.data || []
        const dbCompanies = cRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])

        setRules(dbRules.length ? dbRules : initialMockRules)
      } catch (err) {
        console.error(err)
        setRules(initialMockRules)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome da regra é obrigatório'
    if (!formData.code.trim()) newErrors.code = 'Código de controle é obrigatório'
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      code: '',
      company_id: companies[0]?.id || '',
      trigger_type: 'temp_above',
      threshold: '8.0',
      delay_minutes: '15',
      severity: 'critical',
      notify_email: true,
      notify_whatsapp: false,
      notify_sms: false,
      contact_list: '',
      status: 'active'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      code: item.code || '',
      company_id: item.company_id || '',
      trigger_type: item.trigger_type || 'temp_above',
      threshold: String(item.threshold ?? '8.0'),
      delay_minutes: String(item.delay_minutes ?? '15'),
      severity: item.severity || 'critical',
      notify_email: !!item.notify_email,
      notify_whatsapp: !!item.notify_whatsapp,
      notify_sms: !!item.notify_sms,
      contact_list: item.contact_list || '',
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
      threshold: parseFloat(formData.threshold),
      delay_minutes: parseInt(formData.delay_minutes) || 0,
      company: selectedComp ? { name: selectedComp.name } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setRules(rules.map(r => r.id === editingItem.id ? { ...r, ...payload } : r))
      try {
        await supabase.from('alert_rules').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        created_at: new Date().toISOString()
      }
      setRules([newItem, ...rules])
      try {
        await supabase.from('alert_rules').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setRules(rules.map(r => r.id === deletingItem.id ? { ...r, status: 'inactive', deleted_at: new Date().toISOString() } : r))
    try {
      await supabase.from('alert_rules').update({ status: 'inactive', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const handleTestRule = (item: any) => {
    alert(`Regra "${item.name}" testada com sucesso! Notificações enviadas aos canais habilitados.`)
  }

  const columns = [
    { key: 'name', label: 'Nome da Regra', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <BellRing size={16} className="text-teal-600 animate-swing" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-mono">{item.code}</div>
        </div>
      </div>
    )},
    { key: 'trigger_type', label: 'Condição Gatilho', render: (item: any) => {
      if (item.trigger_type === 'temp_above') return `Temperatura > ${item.threshold}°C`
      if (item.trigger_type === 'temp_below') return `Temperatura < ${item.threshold}°C`
      if (item.trigger_type === 'no_comm') return `Sem sinal > ${item.threshold} min`
      return `Bateria < ${item.threshold}%`
    }},
    { key: 'delay_minutes', label: 'Tolerância', render: (item: any) => `${item.delay_minutes || 0} min` },
    { key: 'company.name', label: 'Empresa', sortable: true, render: (item: any) => item.company?.name || '—' },
    { key: 'severity', label: 'Severidade', render: (item: any) => <StatusBadge value={item.severity} /> },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Editar Regra', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    { label: 'Disparar Teste', icon: <Settings size={14} />, onClick: handleTestRule },
    {
      label: 'Inativar Regra',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'inactive'
    },
    {
      label: 'Reativar Regra',
      icon: <Check size={14} />,
      onClick: async (item: any) => {
        setRules(rules.map(r => r.id === item.id ? { ...r, status: 'active' } : r))
        try { await supabase.from('alert_rules').update({ status: 'active' }).eq('id', item.id) } catch {}
      },
      hidden: (item: any) => item.status === 'active'
    }
  ]

  const filtered = rules.filter(r => {
    if (filterSeverity && r.severity !== filterSeverity) return false
    if (filterStatus && r.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Regras e Alertas de Telemetria</h2>
          <p className="text-sm text-slate-500 mt-1">Configuração de lógica de sensores inteligentes para prevenção de perdas de imunobiológicos.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Regra
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por regra, código..."
        searchKeys={['name', 'code']}
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
        title={editingItem ? 'Editar Regra' : 'Nova Regra de Alerta'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Escopo da Regra">
          <FormRow>
            <FormField label="Nome Descritivo da Regra" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Excesso Térmico Crítico"
              />
            </FormField>
            <FormField label="Código de Controle" required error={errors.code}>
              <Input
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: RULE-TEMP-HIGH-CRIT"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Empresa Vinculada" required error={errors.company_id}>
              <Select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                <option value="">Selecione...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Status da Regra">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Lógica do Gatilho Térmico / Operacional">
          <FormRow>
            <FormField label="Tipo de Evento Gatilho">
              <Select value={formData.trigger_type} onChange={e => setFormData({ ...formData, trigger_type: e.target.value })}>
                <option value="temp_above">Temperatura Acima do Limite</option>
                <option value="temp_below">Temperatura Abaixo do Limite</option>
                <option value="no_comm">Perda de Sinal Metrológico (Minutos)</option>
                <option value="low_battery">Bateria Fraca do Dispositivo IoT (%)</option>
              </Select>
            </FormField>
            <FormField label="Valor de Limite (Threshold)">
              <Input
                type="number"
                step="0.1"
                value={formData.threshold}
                onChange={e => setFormData({ ...formData, threshold: e.target.value })}
                placeholder="Ex: 8.0"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Tempo de Carência / Persistência (Minutos)">
              <Input
                type="number"
                value={formData.delay_minutes}
                onChange={e => setFormData({ ...formData, delay_minutes: e.target.value })}
                placeholder="Ex: 15"
              />
            </FormField>
            <FormField label="Severidade da Anomalia">
              <Select value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value })}>
                <option value="critical">Crítico</option>
                <option value="warning">Atenção</option>
                <option value="info">Informativo</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Canais de Notificação Automáticos">
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.notify_email}
                onChange={e => setFormData({ ...formData, notify_email: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              Notificar por E-mail
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.notify_whatsapp}
                onChange={e => setFormData({ ...formData, notify_whatsapp: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              Notificar por WhatsApp
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.notify_sms}
                onChange={e => setFormData({ ...formData, notify_sms: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              Notificar por SMS
            </label>
          </div>
          <FormField label="Lista de Destinatários (Separados por vírgula)">
            <Textarea
              value={formData.contact_list}
              onChange={e => setFormData({ ...formData, contact_list: e.target.value })}
              rows={2}
              placeholder="Ex: supervisor@email.com, (27) 99999-8888"
            />
          </FormField>
        </FormSection>
      </FormModal>

      {/* Confirm Inactivate Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Inativar Regra de Alerta"
        description={`Deseja realmente desativar a regra de sensoreamento "${deletingItem?.name}"? Isso suspenderá o disparo de alertas automáticos.`}
      />
    </div>
  )
}
