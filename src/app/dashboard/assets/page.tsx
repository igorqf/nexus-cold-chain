'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Eye, Truck } from 'lucide-react'

const initialMockAssets = [
  {
    id: 'a-1',
    name: 'Caminhão Scania P320 Refr.',
    code: 'PLACA-ABC-1234',
    type: 'Caminhão Refrigerado',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    base_id: '22222222-0000-0000-0000-000000000001',
    base: { name: 'CD São Paulo - Guarulhos' },
    capacity_kg: 12000.0,
    min_temp: 2.0,
    max_temp: 8.0,
    insulation_brand: 'Thermo King T-880R',
    status: 'in_operation',
    sensor_code: 'SN-TEMP-9988'
  },
  {
    id: 'a-2',
    name: 'Câmara Fria Primária SP',
    code: 'CAM-SP-01',
    type: 'Câmara Fria',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    base_id: '22222222-0000-0000-0000-000000000001',
    base: { name: 'CD São Paulo - Guarulhos' },
    capacity_kg: 45000.0,
    min_temp: -22.0,
    max_temp: -15.0,
    insulation_brand: 'Mipal Industrial',
    status: 'online',
    sensor_code: 'SN-TEMP-1102'
  },
  {
    id: 'a-3',
    name: 'Furgão Mercedes Sprinter',
    code: 'PLACA-XYZ-9876',
    type: 'Van Refrigerada',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    base_id: '22222222-0000-0000-0000-000000000004',
    base: { name: 'CD Belo Horizonte' },
    capacity_kg: 1800.0,
    min_temp: 15.0,
    max_temp: 25.0,
    insulation_brand: 'Carrier Citimax 280',
    status: 'maintenance',
    sensor_code: 'SN-TEMP-4455'
  }
]

export default function AssetsCRUD() {
  const supabase = createClient()
  const [assets, setAssets] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [bases, setBases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsItem, setDetailsItem] = useState<any>(null)

  // Filters
  const [filterCompany, setFilterCompany] = useState('')
  const [filterBase, setFilterBase] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Caminhão Refrigerado',
    company_id: '',
    base_id: '',
    capacity_kg: '',
    min_temp: '2.0',
    max_temp: '8.0',
    insulation_brand: '',
    status: 'online',
    sensor_code: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [aRes, cRes, bRes] = await Promise.all([
          supabase.from('assets').select('*, companies(name), operational_bases(name)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null),
          supabase.from('operational_bases').select('id, name, company_id').is('deleted_at', null)
        ])

        const dbAssets = aRes.data || []
        const dbCompanies = cRes.data || []
        const dbBases = bRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000002', name: 'Aguia Branca Transportes' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])
        setBases(dbBases.length ? dbBases : [
          { id: '22222222-0000-0000-0000-000000000001', name: 'CD São Paulo - Guarulhos' },
          { id: '22222222-0000-0000-0000-000000000004', name: 'CD Belo Horizonte' }
        ])

        setAssets(dbAssets.length ? dbAssets : initialMockAssets)
      } catch (err) {
        console.error(err)
        setAssets(initialMockAssets)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome ou modelo do ativo é obrigatório'
    if (!formData.code.trim()) newErrors.code = 'Código ou Placa é obrigatório'
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      code: '',
      type: 'Caminhão Refrigerado',
      company_id: companies[0]?.id || '',
      base_id: bases[0]?.id || '',
      capacity_kg: '5000',
      min_temp: '2.0',
      max_temp: '8.0',
      insulation_brand: 'Thermo King',
      status: 'online',
      sensor_code: ''
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      code: item.code || '',
      type: item.type || 'Caminhão Refrigerado',
      company_id: item.company_id || '',
      base_id: item.base_id || '',
      capacity_kg: String(item.capacity_kg || ''),
      min_temp: String(item.min_temp ?? '2.0'),
      max_temp: String(item.max_temp ?? '8.0'),
      insulation_brand: item.insulation_brand || '',
      status: item.status || 'online',
      sensor_code: item.sensor_code || ''
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedComp = companies.find(c => c.id === formData.company_id)
    const selectedBase = bases.find(b => b.id === formData.base_id)

    const payload = {
      ...formData,
      capacity_kg: parseFloat(formData.capacity_kg) || null,
      min_temp: parseFloat(formData.min_temp),
      max_temp: parseFloat(formData.max_temp),
      company: selectedComp ? { name: selectedComp.name } : null,
      base: selectedBase ? { name: selectedBase.name } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setAssets(assets.map(a => a.id === editingItem.id ? { ...a, ...payload } : a))
      try {
        await supabase.from('assets').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        created_at: new Date().toISOString()
      }
      setAssets([newItem, ...assets])
      try {
        await supabase.from('assets').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setAssets(assets.map(a => a.id === deletingItem.id ? { ...a, status: 'offline', deleted_at: new Date().toISOString() } : a))
    try {
      await supabase.from('assets').update({ status: 'offline', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'name', label: 'Ativo', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <Truck size={16} className="text-teal-600" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-normal">{item.code} · {item.type}</div>
        </div>
      </div>
    )},
    { key: 'company.name', label: 'Empresa', sortable: true, render: (item: any) => item.company?.name || '—' },
    { key: 'base.name', label: 'Base Operacional', sortable: true, render: (item: any) => item.base?.name || '—' },
    { key: 'sensor_code', label: 'Sensor IoT', render: (item: any) => item.sensor_code ? <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-semibold">{item.sensor_code}</code> : 'Nenhum' },
    { key: 'range', label: 'Faixa Ideal', render: (item: any) => `${item.min_temp} °C a ${item.max_temp} °C` },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Ver Detalhes', icon: <Eye size={14} />, onClick: (item: any) => { setDetailsItem(item); setDetailsOpen(true) } },
    { label: 'Editar Ativo', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    {
      label: 'Excluir Ativo',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'offline'
    }
  ]

  const filtered = assets.filter(a => {
    if (filterCompany && a.company_id !== filterCompany) return false
    if (filterBase && a.base_id !== filterBase) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestão de Ativos Refrigerados</h2>
          <p className="text-sm text-slate-500 mt-1">Frota de transporte, câmaras frias, freezers e contêineres térmicos.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Ativo
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por placa, nome, tipo..."
        searchKeys={['name', 'code', 'type', 'sensor_code']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Empresa">
              <Select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                <option value="">Todas</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Base">
              <Select value={filterBase} onChange={e => setFilterBase(e.target.value)}>
                <option value="">Todas</option>
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Status">
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="in_operation">Em Operação</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Manutenção</option>
              </Select>
            </FormField>
          </div>
        }
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Ativo' : 'Novo Ativo'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Dados Básicos">
          <FormRow>
            <FormField label="Nome / Modelo do Ativo" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Scania P320 Refr. #04"
              />
            </FormField>
            <FormField label="Identificador Único (Placa/ID)" required error={errors.code}>
              <Input
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: PLACA-ABC-1234 ou CAM-01"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Tipo de Ativo">
              <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="Caminhão Refrigerado">Caminhão Refrigerado</option>
                <option value="Van Refrigerada">Van Refrigerada</option>
                <option value="Câmara Fria">Câmara Fria</option>
                <option value="Contêiner Térmico">Contêiner Térmico</option>
                <option value="Geladeira de Vacinas">Geladeira de Vacinas</option>
              </Select>
            </FormField>
            <FormField label="Status Operacional">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="online">Online / Disponível</option>
                <option value="in_operation">Em Operação</option>
                <option value="maintenance">Manutenção</option>
                <option value="offline">Inativo</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Vínculos e Capacidade">
          <FormRow>
            <FormField label="Empresa Detentora" required error={errors.company_id}>
              <Select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                <option value="">Selecione...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Base de Operação">
              <Select value={formData.base_id} onChange={e => setFormData({ ...formData, base_id: e.target.value })}>
                <option value="">Nenhuma base vinculada</option>
                {bases.filter(b => !formData.company_id || b.company_id === formData.company_id).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Capacidade Máxima de Carga (kg)">
              <Input
                type="number"
                value={formData.capacity_kg}
                onChange={e => setFormData({ ...formData, capacity_kg: e.target.value })}
                placeholder="Ex: 12000"
              />
            </FormField>
            <FormField label="Código do Sensor Vinculado (Opcional)">
              <Input
                value={formData.sensor_code}
                onChange={e => setFormData({ ...formData, sensor_code: e.target.value })}
                placeholder="Ex: SN-TEMP-9988"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Controle Térmico (Parâmetros Regulatórios)">
          <FormRow>
            <FormField label="Temperatura Mínima Permitida (°C)">
              <Input
                type="number"
                step="0.5"
                value={formData.min_temp}
                onChange={e => setFormData({ ...formData, min_temp: e.target.value })}
                placeholder="Ex: 2.0"
              />
            </FormField>
            <FormField label="Temperatura Máxima Permitida (°C)">
              <Input
                type="number"
                step="0.5"
                value={formData.max_temp}
                onChange={e => setFormData({ ...formData, max_temp: e.target.value })}
                placeholder="Ex: 8.0"
              />
            </FormField>
          </FormRow>
          <FormField label="Especificação Técnica do Termo-Isolante / Refrigeração">
            <Input
              value={formData.insulation_brand}
              onChange={e => setFormData({ ...formData, insulation_brand: e.target.value })}
              placeholder="Ex: Thermo King T-880R com isolamento PU 100mm"
            />
          </FormField>
        </FormSection>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Inativar/Excluir Ativo"
        description={`Deseja realmente inativar o ativo ${deletingItem?.name}? Ele será marcado como offline e removido dos painéis ativos.`}
      />

      {/* Details View */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Detalhamento de Ativo — ${detailsItem?.code || ''}`}
        subtitle="Registro completo de controle de cadeia de frio."
      >
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-medium">Nome do Ativo:</span>
              <span className="font-bold text-slate-800">{detailsItem?.name || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Tipo de Ativo:</span>
              <span className="font-bold text-slate-800">{detailsItem?.type || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Empresa Responsável:</span>
              <span className="font-bold text-slate-800">{detailsItem?.company?.name || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Base Operacional:</span>
              <span className="font-bold text-slate-800">{detailsItem?.base?.name || '—'}</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">Configuração da Cadeia de Frio GxP:</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Temp Mínima</span>
                <span className="text-sm font-bold text-blue-600">{detailsItem?.min_temp} °C</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Temp Máxima</span>
                <span className="text-sm font-bold text-red-600">{detailsItem?.max_temp} °C</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-150">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Capacidade</span>
                <span className="text-sm font-bold text-slate-700">{(detailsItem?.capacity_weight_kg || detailsItem?.capacity_kg || 0) / 1000} ton</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-slate-400 font-medium">Sensor IoT Conectado:</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs inline-block mt-1">
                {detailsItem?.sensor_code || 'Não Vinculado'}
              </span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Equipamento Térmico:</span>
              <span className="font-bold text-slate-800">{detailsItem?.insulation_brand || '—'}</span>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
