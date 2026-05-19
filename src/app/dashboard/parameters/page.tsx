'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select, Textarea } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Sliders } from 'lucide-react'

const initialMockParameters = [
  {
    id: 'pm-1',
    name: 'Refrigerados Comuns (Vacinas/Insulinas)',
    code: 'COLD-REF-01',
    temp_min: 2.0,
    temp_max: 8.0,
    alert_temp_min: 3.0,
    alert_temp_max: 7.0,
    humidity_min: 35,
    humidity_max: 65,
    regulation_body: 'ANVISA',
    regulation_norm: 'RDC 430/2020 & GxP',
    max_deviation_minutes: 15,
    status: 'active'
  },
  {
    id: 'pm-2',
    name: 'Congelados de Alta Temperatura (Vacinas/Plasma)',
    code: 'COLD-CONG-02',
    temp_min: -25.0,
    temp_max: -15.0,
    alert_temp_min: -23.0,
    alert_temp_max: -17.0,
    humidity_min: 0,
    humidity_max: 100,
    regulation_body: 'ANVISA',
    regulation_norm: 'RDC 430/2020',
    max_deviation_minutes: 10,
    status: 'active'
  },
  {
    id: 'pm-3',
    name: 'Ambiente Controlado (Hemoderivados)',
    code: 'COLD-AMB-03',
    temp_min: 15.0,
    temp_max: 25.0,
    alert_temp_min: 17.0,
    alert_temp_max: 23.0,
    humidity_min: 20,
    humidity_max: 70,
    regulation_body: 'ANVISA',
    regulation_norm: 'RDC 430/2020',
    max_deviation_minutes: 30,
    status: 'active'
  }
]

export default function ParametersCRUD() {
  const supabase = createClient()
  const [parameters, setParameters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    temp_min: '2.0',
    temp_max: '8.0',
    alert_temp_min: '3.0',
    alert_temp_max: '7.0',
    humidity_min: '35',
    humidity_max: '65',
    regulation_body: 'ANVISA',
    regulation_norm: 'RDC 430/2020',
    max_deviation_minutes: '15',
    status: 'active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase.from('cold_chain_parameters').select('*').is('deleted_at', null)
        if (error) throw error
        setParameters(data && data.length ? data : initialMockParameters)
      } catch (err) {
        console.error(err)
        setParameters(initialMockParameters)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome do perfil de parâmetros é obrigatório'
    if (!formData.code.trim()) newErrors.code = 'Código de identificação é obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      code: '',
      temp_min: '2.0',
      temp_max: '8.0',
      alert_temp_min: '3.0',
      alert_temp_max: '7.0',
      humidity_min: '35',
      humidity_max: '65',
      regulation_body: 'ANVISA',
      regulation_norm: 'RDC 430/2020',
      max_deviation_minutes: '15',
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
      temp_min: String(item.temp_min ?? '2.0'),
      temp_max: String(item.temp_max ?? '8.0'),
      alert_temp_min: String(item.alert_temp_min ?? '3.0'),
      alert_temp_max: String(item.alert_temp_max ?? '7.0'),
      humidity_min: String(item.humidity_min ?? '35'),
      humidity_max: String(item.humidity_max ?? '65'),
      regulation_body: item.regulation_body || 'ANVISA',
      regulation_norm: item.regulation_norm || '',
      max_deviation_minutes: String(item.max_deviation_minutes ?? '15'),
      status: item.status || 'active'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      ...formData,
      temp_min: parseFloat(formData.temp_min),
      temp_max: parseFloat(formData.temp_max),
      alert_temp_min: parseFloat(formData.alert_temp_min),
      alert_temp_max: parseFloat(formData.alert_temp_max),
      humidity_min: parseInt(formData.humidity_min) || null,
      humidity_max: parseInt(formData.humidity_max) || null,
      max_deviation_minutes: parseInt(formData.max_deviation_minutes) || null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setParameters(parameters.map(p => p.id === editingItem.id ? { ...p, ...payload } : p))
      try {
        await supabase.from('cold_chain_parameters').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        created_at: new Date().toISOString()
      }
      setParameters([newItem, ...parameters])
      try {
        await supabase.from('cold_chain_parameters').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setParameters(parameters.map(p => p.id === deletingItem.id ? { ...p, status: 'inactive', deleted_at: new Date().toISOString() } : p))
    try {
      await supabase.from('cold_chain_parameters').update({ status: 'inactive', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'name', label: 'Perfil Cold Chain', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <Sliders size={16} className="text-teal-600" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-mono">{item.code}</div>
        </div>
      </div>
    )},
    { key: 'temp_range', label: 'Faixa Aceitável', render: (item: any) => `${item.temp_min} °C a ${item.temp_max} °C` },
    { key: 'alert_range', label: 'Faixa de Alerta', render: (item: any) => `${item.alert_temp_min} °C a ${item.alert_temp_max} °C` },
    { key: 'deviation', label: 'Tempo Limite Desvio', render: (item: any) => `${item.max_deviation_minutes || 0} min` },
    { key: 'regulation', label: 'Regulamentação', render: (item: any) => `${item.regulation_body} (${item.regulation_norm})` },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Editar Parâmetros', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    {
      label: 'Inativar',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'inactive'
    },
    {
      label: 'Reativar',
      icon: <Check size={14} />,
      onClick: async (item: any) => {
        setParameters(parameters.map(p => p.id === item.id ? { ...p, status: 'active' } : p))
        try { await supabase.from('cold_chain_parameters').update({ status: 'active' }).eq('id', item.id) } catch {}
      },
      hidden: (item: any) => item.status === 'active'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestão de Parâmetros de Cold Chain</h2>
          <p className="text-sm text-slate-500 mt-1">Configuração de faixas térmicas ideais, margens de alerta e tempos tolerados de desvio regulados por lei.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Perfil Parâmetros
        </button>
      </div>

      <DataTable
        data={parameters}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por nome, norma..."
        searchKeys={['name', 'code', 'regulation_norm']}
        loading={loading}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Perfil Térmico' : 'Novo Perfil Térmico de Parâmetros'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Configuração Geral">
          <FormRow>
            <FormField label="Nome do Perfil Térmico" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Refrigerados 2°C a 8°C"
              />
            </FormField>
            <FormField label="Código Único do Parâmetro" required error={errors.code}>
              <Input
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: COLD-REF-01"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Órgão Regulador">
              <Select value={formData.regulation_body} onChange={e => setFormData({ ...formData, regulation_body: e.target.value })}>
                <option value="ANVISA">ANVISA</option>
                <option value="FDA">FDA (EUA)</option>
                <option value="EMA">EMA (Europa)</option>
                <option value="MAPA">MAPA</option>
                <option value="Interno">Norma Interna / Outro</option>
              </Select>
            </FormField>
            <FormField label="Resolução / Norma Associada">
              <Input
                value={formData.regulation_norm}
                onChange={e => setFormData({ ...formData, regulation_norm: e.target.value })}
                placeholder="Ex: RDC 430/2020 Art. 12"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Parâmetros de Tolerância Térmica">
          <FormRow>
            <FormField label="Temp Mínima Permitida (°C)">
              <Input
                type="number"
                step="0.1"
                value={formData.temp_min}
                onChange={e => setFormData({ ...formData, temp_min: e.target.value })}
                placeholder="Ex: 2.0"
              />
            </FormField>
            <FormField label="Temp Máxima Permitida (°C)">
              <Input
                type="number"
                step="0.1"
                value={formData.temp_max}
                onChange={e => setFormData({ ...formData, temp_max: e.target.value })}
                placeholder="Ex: 8.0"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Temp Mínima Alerta / Pré-Alarme (°C)">
              <Input
                type="number"
                step="0.1"
                value={formData.alert_temp_min}
                onChange={e => setFormData({ ...formData, alert_temp_min: e.target.value })}
                placeholder="Ex: 3.0"
              />
            </FormField>
            <FormField label="Temp Máxima Alerta / Pré-Alarme (°C)">
              <Input
                type="number"
                step="0.1"
                value={formData.alert_temp_max}
                onChange={e => setFormData({ ...formData, alert_temp_max: e.target.value })}
                placeholder="Ex: 7.0"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Umidade e Tempo de Desvio">
          <FormRow>
            <FormField label="Umidade Mínima (%)">
              <Input
                type="number"
                value={formData.humidity_min}
                onChange={e => setFormData({ ...formData, humidity_min: e.target.value })}
                placeholder="Ex: 35"
              />
            </FormField>
            <FormField label="Umidade Máxima (%)">
              <Input
                type="number"
                value={formData.humidity_max}
                onChange={e => setFormData({ ...formData, humidity_max: e.target.value })}
                placeholder="Ex: 65"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Tempo Limite de Desvio Contínuo (minutos)">
              <Input
                type="number"
                value={formData.max_deviation_minutes}
                onChange={e => setFormData({ ...formData, max_deviation_minutes: e.target.value })}
                placeholder="Ex: 15"
              />
            </FormField>
            <FormField label="Status">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>
      </FormModal>

      {/* Confirm Inactivate Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Inativar Parâmetro"
        description={`Deseja inativar o perfil de parâmetros ${deletingItem?.name}? Ativos associados continuarão vinculados, mas novos alertas não herdarão essa regra.`}
      />
    </div>
  )
}
