'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Eye, MapPin } from 'lucide-react'

const initialMockBases = [
  {
    id: '22222222-0000-0000-0000-000000000001',
    name: 'CD São Paulo - Guarulhos',
    code: 'BASE-GRU-01',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    cep: '07140-000',
    street: 'Estrada do Aeroporto',
    number: '1200',
    neighborhood: 'Jardim Aeroporto',
    city: 'Guarulhos',
    state: 'SP',
    manager_name: 'Marcos Silva',
    manager_email: 'marcos.silva@nexusvital.com',
    manager_phone: '(11) 98888-1234',
    capacity_m3: 450.5,
    target_temp: 5.0, // target temperature in celsius
    status: 'active',
    sensor_count: 8,
    asset_count: 5
  },
  {
    id: '22222222-0000-0000-0000-000000000004',
    name: 'CD Belo Horizonte',
    code: 'BASE-BH-02',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    cep: '32000-000',
    street: 'Via Expressa',
    number: '450',
    neighborhood: 'Industrial',
    city: 'Contagem',
    state: 'MG',
    manager_name: 'Juliana Costa',
    manager_email: 'juliana.costa@farmacool.com',
    manager_phone: '(31) 97777-5555',
    capacity_m3: 320.0,
    target_temp: 4.5,
    status: 'active',
    sensor_count: 5,
    asset_count: 3
  }
]

export default function BasesCRUD() {
  const supabase = createClient()
  const [bases, setBases] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
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
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    company_id: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    manager_name: '',
    manager_email: '',
    manager_phone: '',
    capacity_m3: '',
    target_temp: '5.0',
    status: 'active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [bRes, cRes] = await Promise.all([
          supabase.from('operational_bases').select('*, companies(name)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null)
        ])

        const dbBases = bRes.data || []
        const dbCompanies = cRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000002', name: 'Aguia Branca Transportes' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])

        setBases(dbBases.length ? dbBases : initialMockBases)
      } catch (err) {
        console.error(err)
        setBases(initialMockBases)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome da base é obrigatório'
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
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: 'SP',
      manager_name: '',
      manager_email: '',
      manager_phone: '',
      capacity_m3: '200',
      target_temp: '5.0',
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
      cep: item.cep || '',
      street: item.street || '',
      number: item.number || '',
      neighborhood: item.neighborhood || '',
      city: item.city || '',
      state: item.state || 'SP',
      manager_name: item.manager_name || '',
      manager_email: item.manager_email || '',
      manager_phone: item.manager_phone || '',
      capacity_m3: String(item.capacity_m3 || ''),
      target_temp: String(item.target_temp || '5.0'),
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
      capacity_m3: parseFloat(formData.capacity_m3) || null,
      target_temp: parseFloat(formData.target_temp) || 5.0,
      company: selectedComp ? { name: selectedComp.name } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setBases(bases.map(b => b.id === editingItem.id ? { ...b, ...payload } : b))
      try {
        await supabase.from('operational_bases').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        sensor_count: 0,
        asset_count: 0,
        created_at: new Date().toISOString()
      }
      setBases([newItem, ...bases])
      try {
        await supabase.from('operational_bases').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setBases(bases.map(b => b.id === deletingItem.id ? { ...b, status: 'inactive', deleted_at: new Date().toISOString() } : b))
    try {
      await supabase.from('operational_bases').update({ status: 'inactive', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'name', label: 'Nome da Base', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <MapPin size={16} className="text-teal-600" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-normal">{item.code}</div>
        </div>
      </div>
    )},
    { key: 'company.name', label: 'Empresa Vinculada', sortable: true, render: (item: any) => item.company?.name || '—' },
    { key: 'city', label: 'Cidade/UF', render: (item: any) => `${item.city || '—'} / ${item.state || '—'}` },
    { key: 'manager_name', label: 'Responsável' },
    { key: 'target_temp', label: 'Temp. Alvo', render: (item: any) => `${item.target_temp || '—'} °C` },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Ver Detalhes', icon: <Eye size={14} />, onClick: (item: any) => { setDetailsItem(item); setDetailsOpen(true) } },
    { label: 'Editar', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
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
        setBases(bases.map(b => b.id === item.id ? { ...b, status: 'active' } : b))
        try { await supabase.from('operational_bases').update({ status: 'active' }).eq('id', item.id) } catch {}
      },
      hidden: (item: any) => item.status === 'active'
    }
  ]

  const filtered = bases.filter(b => {
    if (filterCompany && b.company_id !== filterCompany) return false
    if (filterStatus && b.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestão de Bases Operacionais</h2>
          <p className="text-sm text-slate-500 mt-1">Pontos fixos de transbordo, cross-docking e CDs refrigerados.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Base
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por nome ou código..."
        searchKeys={['name', 'code', 'city']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Filtrar por Empresa">
              <Select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                <option value="">Todas</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
        title={editingItem ? 'Editar Base Operacional' : 'Nova Base Operacional'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Dados da Base">
          <FormRow>
            <FormField label="Nome da Base" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: CD Guarulhos"
              />
            </FormField>
            <FormField label="Código de Controle" required error={errors.code}>
              <Input
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: BASE-GRU-01"
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
            <FormField label="Temperatura Alvo (°C)">
              <Input
                type="number"
                step="0.1"
                value={formData.target_temp}
                onChange={e => setFormData({ ...formData, target_temp: e.target.value })}
                placeholder="Ex: 5.0"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Capacidade Estimada (m³)">
              <Input
                type="number"
                value={formData.capacity_m3}
                onChange={e => setFormData({ ...formData, capacity_m3: e.target.value })}
                placeholder="Ex: 400"
              />
            </FormField>
            <FormField label="Status Operacional">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Endereço da Base">
          <FormRow>
            <FormField label="CEP">
              <Input
                value={formData.cep}
                onChange={e => setFormData({ ...formData, cep: e.target.value })}
                placeholder="00000-000"
              />
            </FormField>
            <FormField label="Logradouro">
              <Input
                value={formData.street}
                onChange={e => setFormData({ ...formData, street: e.target.value })}
                placeholder="Avenida, Rua..."
              />
            </FormField>
          </FormRow>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Número">
              <Input
                value={formData.number}
                onChange={e => setFormData({ ...formData, number: e.target.value })}
                placeholder="Nº"
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Bairro">
                <Input
                  value={formData.neighborhood}
                  onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                  placeholder="Bairro"
                />
              </FormField>
            </div>
            <FormField label="Estado (UF)">
              <Select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })}>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="ES">ES</option>
                <option value="MG">MG</option>
                <option value="PR">PR</option>
                <option value="SC">SC</option>
                <option value="RS">RS</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Cidade">
            <Input
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              placeholder="Cidade"
            />
          </FormField>
        </FormSection>

        <FormSection title="Gerenciamento Técnico">
          <FormField label="Nome do Gerente/Responsável">
            <Input
              value={formData.manager_name}
              onChange={e => setFormData({ ...formData, manager_name: e.target.value })}
              placeholder="Nome do gerente"
            />
          </FormField>
          <FormRow>
            <FormField label="E-mail de Contato">
              <Input
                type="email"
                value={formData.manager_email}
                onChange={e => setFormData({ ...formData, manager_email: e.target.value })}
                placeholder="gerente@empresa.com"
              />
            </FormField>
            <FormField label="Telefone do Responsável">
              <Input
                value={formData.manager_phone}
                onChange={e => setFormData({ ...formData, manager_phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </FormField>
          </FormRow>
        </FormSection>
      </FormModal>

      {/* Confirm Inactivate Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Inativar Base Operacional"
        description={`Tem certeza que deseja inativar a base ${deletingItem?.name}? Sensores e ativos associados a essa base ficarão sem vínculo regional.`}
      />

      {/* Details Modal */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Detalhes — ${detailsItem?.name || ''}`}
        subtitle="Informações técnicas da filial operacional."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-medium">Código Interno:</span>
              <span className="font-bold text-slate-800">{detailsItem?.code || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Empresa Vinculada:</span>
              <span className="font-bold text-slate-800">{detailsItem?.company?.name || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Temperatura Alvo:</span>
              <span className="font-bold text-teal-600">{detailsItem?.target_temp} °C</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Capacidade Armazenamento:</span>
              <span className="font-bold text-slate-800">{detailsItem?.capacity_m3} m³</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Localização:</h4>
            <p className="text-slate-600 text-sm">
              {detailsItem?.street}, {detailsItem?.number} - {detailsItem?.neighborhood}<br />
              {detailsItem?.city} / {detailsItem?.state} - CEP {detailsItem?.cep}
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Gerência Responsável:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="block text-xs text-slate-400 font-medium uppercase">Gerente</span>
                <span className="font-bold text-slate-800">{detailsItem?.manager_name || '—'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium uppercase">Telefone</span>
                <span className="font-bold text-slate-800">{detailsItem?.manager_phone || '—'}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-slate-400 font-medium uppercase">E-mail</span>
                <span className="font-bold text-slate-800">{detailsItem?.manager_email || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
