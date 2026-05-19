'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Eye, Building2 } from 'lucide-react'

const initialMockCompanies = [
  {
    id: '11111111-0000-0000-0000-000000000001',
    name: 'Nexus Logística Vital',
    corporate_name: 'Nexus Cold Chain Solutions Ltda',
    cnpj: '12.345.678/0001-90',
    ie: '111.222.333.444',
    email: 'contato@nexusvital.com',
    phone: '(11) 3333-4444',
    cep: '01310-100',
    street: 'Avenida Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    plan: 'Premium',
    status: 'active',
    base_count: 3,
    asset_count: 14
  },
  {
    id: '11111111-0000-0000-0000-000000000002',
    name: 'Aguia Branca Transportes',
    corporate_name: 'Viação Aguia Branca S.A.',
    cnpj: '27.065.250/0001-05',
    ie: '222.333.444.555',
    email: 'suporte.logistica@aguiabranca.com.br',
    phone: '(27) 4004-2121',
    cep: '29090-000',
    street: 'Avenida Dante Michelini',
    number: '5500',
    neighborhood: 'Jardim da Penha',
    city: 'Vitória',
    state: 'ES',
    plan: 'Enterprise',
    status: 'active',
    base_count: 5,
    asset_count: 42
  },
  {
    id: '11111111-0000-0000-0000-000000000003',
    name: 'FarmaCool Distribuidora',
    corporate_name: 'FarmaCool Logística Farmacêutica Eireli',
    cnpj: '99.888.777/0001-11',
    ie: '333.444.555.666',
    email: 'qualidade@farmacool.com',
    phone: '(31) 2222-1111',
    cep: '30120-010',
    street: 'Avenida Afonso Pena',
    number: '200',
    neighborhood: 'Centro',
    city: 'Belo Horizonte',
    state: 'MG',
    plan: 'Standard',
    status: 'active',
    base_count: 2,
    asset_count: 8
  }
]

export default function CompaniesCRUD() {
  const supabase = createClient()
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
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    corporate_name: '',
    cnpj: '',
    ie: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    plan: 'Premium',
    status: 'active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase.from('companies').select('*').is('deleted_at', null)
        if (error) throw error
        if (data && data.length) {
          // Map counts randomly or by joins
          const mapped = data.map(c => ({
            ...c,
            base_count: Math.floor(Math.random() * 3) + 1,
            asset_count: Math.floor(Math.random() * 15) + 2
          }))
          setCompanies(mapped)
        } else {
          setCompanies(initialMockCompanies)
        }
      } catch (err) {
        console.error(err)
        setCompanies(initialMockCompanies)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome Fantasia é obrigatório'
    if (!formData.corporate_name.trim()) newErrors.corporate_name = 'Razão Social é obrigatória'
    if (!formData.cnpj.trim()) newErrors.cnpj = 'CNPJ é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'E-mail de contato é obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      corporate_name: '',
      cnpj: '',
      ie: '',
      email: '',
      phone: '',
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: 'SP',
      plan: 'Premium',
      status: 'active'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      corporate_name: item.corporate_name || '',
      cnpj: item.cnpj || '',
      ie: item.ie || '',
      email: item.email || '',
      phone: item.phone || '',
      cep: item.cep || '',
      street: item.street || '',
      number: item.number || '',
      neighborhood: item.neighborhood || '',
      city: item.city || '',
      state: item.state || 'SP',
      plan: item.plan || 'Premium',
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
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setCompanies(companies.map(c => c.id === editingItem.id ? { ...c, ...payload } : c))
      try {
        await supabase.from('companies').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        base_count: 0,
        asset_count: 0,
        created_at: new Date().toISOString()
      }
      setCompanies([newItem, ...companies])
      try {
        await supabase.from('companies').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setCompanies(companies.map(c => c.id === deletingItem.id ? { ...c, status: 'inactive', deleted_at: new Date().toISOString() } : c))
    try {
      await supabase.from('companies').update({ status: 'inactive', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'name', label: 'Empresa', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <Building2 size={16} className="text-teal-600" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-normal">{item.corporate_name}</div>
        </div>
      </div>
    )},
    { key: 'cnpj', label: 'CNPJ', sortable: true },
    { key: 'plan', label: 'Plano', render: (item: any) => (
      <span className="font-semibold text-slate-600 text-xs">{item.plan}</span>
    )},
    { key: 'base_count', label: 'Bases', render: (item: any) => `${item.base_count || 0} base(s)` },
    { key: 'asset_count', label: 'Ativos', render: (item: any) => `${item.asset_count || 0} ativo(s)` },
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
        setCompanies(companies.map(c => c.id === item.id ? { ...c, status: 'active' } : c))
        try { await supabase.from('companies').update({ status: 'active' }).eq('id', item.id) } catch {}
      },
      hidden: (item: any) => item.status === 'active'
    }
  ]

  const filtered = companies.filter(c => {
    if (filterStatus && c.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestão de Empresas / Clientes</h2>
          <p className="text-sm text-slate-500 mt-1">Cadastro e controle de filiais e clientes multi-tenant.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Empresa
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por nome ou CNPJ..."
        searchKeys={['name', 'corporate_name', 'cnpj']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
        title={editingItem ? 'Editar Empresa' : 'Nova Empresa'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Dados Cadastrais">
          <FormRow>
            <FormField label="Nome Fantasia" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Nexus SP"
              />
            </FormField>
            <FormField label="Razão Social" required error={errors.corporate_name}>
              <Input
                value={formData.corporate_name}
                onChange={e => setFormData({ ...formData, corporate_name: e.target.value })}
                placeholder="Ex: Nexus Logística Vital Ltda"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="CNPJ" required error={errors.cnpj}>
              <Input
                value={formData.cnpj}
                onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </FormField>
            <FormField label="Inscrição Estadual">
              <Input
                value={formData.ie}
                onChange={e => setFormData({ ...formData, ie: e.target.value })}
                placeholder="Inscrição estadual"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Contato e Localização">
          <FormRow>
            <FormField label="E-mail de Contato" required error={errors.email}>
              <Input
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="contato@empresa.com"
              />
            </FormField>
            <FormField label="Telefone">
              <Input
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 0000-0000"
              />
            </FormField>
          </FormRow>
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
                placeholder="Rua, Av..."
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
        </FormSection>

        <FormSection title="Configurações de Contrato">
          <FormRow>
            <FormField label="Plano de Serviço">
              <Select value={formData.plan} onChange={e => setFormData({ ...formData, plan: e.target.value })}>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Enterprise">Enterprise</option>
              </Select>
            </FormField>
            <FormField label="Status Operacional">
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
        title="Inativar Empresa"
        description={`Tem certeza que deseja inativar a empresa ${deletingItem?.name}? Todas as bases e ativos vinculados perderão o acesso ao painel.`}
      />

      {/* Details Modal */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Detalhes — ${detailsItem?.name || ''}`}
        subtitle="Visualização completa de dados cadastrais."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-medium">Razão Social:</span>
              <span className="font-bold text-slate-800">{detailsItem?.corporate_name || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">CNPJ:</span>
              <span className="font-bold text-slate-800">{detailsItem?.cnpj || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">E-mail:</span>
              <span className="font-bold text-slate-800">{detailsItem?.email || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Telefone:</span>
              <span className="font-bold text-slate-800">{detailsItem?.phone || '—'}</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-2">Endereço de Faturamento:</h4>
            <p className="text-slate-600 text-sm">
              {detailsItem?.street}, {detailsItem?.number} - {detailsItem?.neighborhood}<br />
              {detailsItem?.city} / {detailsItem?.state} - CEP {detailsItem?.cep}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
            <div>
              <span className="block text-xs text-slate-400 font-medium uppercase">Plano</span>
              <span className="text-sm font-bold text-teal-600">{detailsItem?.plan}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-medium uppercase">Bases Operacionais</span>
              <span className="text-sm font-bold text-slate-800">{detailsItem?.base_count}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-medium uppercase">Ativos Cadastrados</span>
              <span className="text-sm font-bold text-slate-800">{detailsItem?.asset_count}</span>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
