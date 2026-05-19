'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select, Textarea } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Eye, Package } from 'lucide-react'

const initialMockProducts = [
  {
    id: 'p-1',
    name: 'Vacina Influenza Quadrivalente',
    sku: 'VAC-INF-001',
    category: 'Vacinas',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    temp_min: 2.0,
    temp_max: 8.0,
    humidity_min: 35,
    humidity_max: 65,
    special_requirements: 'Proteger contra incidência direta de luz. Não congelar sob hipótese alguma.',
    status: 'active'
  },
  {
    id: 'p-2',
    name: 'Insulina Glargina 100 U/ml',
    sku: 'INS-GLA-102',
    category: 'Insulinas',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    temp_min: 2.0,
    temp_max: 8.0,
    humidity_min: 30,
    humidity_max: 70,
    special_requirements: 'Evitar agitação mecânica excessiva. Manter na embalagem original.',
    status: 'active'
  },
  {
    id: 'p-3',
    name: 'Hemoderivado Albumina Humana 20%',
    sku: 'HEM-ALB-303',
    category: 'Hemoderivados',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    temp_min: 15.0,
    temp_max: 25.0,
    humidity_min: 20,
    humidity_max: 80,
    special_requirements: 'Temperatura ambiente controlada. Verificar integridade do lacre antes de estocar.',
    status: 'active'
  }
]

export default function ProductsCRUD() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
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
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Vacinas',
    company_id: '',
    temp_min: '2.0',
    temp_max: '8.0',
    humidity_min: '35',
    humidity_max: '65',
    special_requirements: '',
    status: 'active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, cRes] = await Promise.all([
          supabase.from('products').select('*, companies(name)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null)
        ])

        const dbProducts = pRes.data || []
        const dbCompanies = cRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])

        setProducts(dbProducts.length ? dbProducts : initialMockProducts)
      } catch (err) {
        console.error(err)
        setProducts(initialMockProducts)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome do produto é obrigatório'
    if (!formData.sku.trim()) newErrors.sku = 'SKU ou Código interno é obrigatório'
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      sku: '',
      category: 'Vacinas',
      company_id: companies[0]?.id || '',
      temp_min: '2.0',
      temp_max: '8.0',
      humidity_min: '35',
      humidity_max: '65',
      special_requirements: '',
      status: 'active'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      sku: item.sku || '',
      category: item.category || 'Vacinas',
      company_id: item.company_id || '',
      temp_min: String(item.temp_min ?? '2.0'),
      temp_max: String(item.temp_max ?? '8.0'),
      humidity_min: String(item.humidity_min ?? '35'),
      humidity_max: String(item.humidity_max ?? '65'),
      special_requirements: item.special_requirements || '',
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
      temp_min: parseFloat(formData.temp_min),
      temp_max: parseFloat(formData.temp_max),
      humidity_min: parseInt(formData.humidity_min) || null,
      humidity_max: parseInt(formData.humidity_max) || null,
      company: selectedComp ? { name: selectedComp.name } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setProducts(products.map(p => p.id === editingItem.id ? { ...p, ...payload } : p))
      try {
        await supabase.from('products').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        created_at: new Date().toISOString()
      }
      setProducts([newItem, ...products])
      try {
        await supabase.from('products').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setProducts(products.map(p => p.id === deletingItem.id ? { ...p, status: 'inactive', deleted_at: new Date().toISOString() } : p))
    try {
      await supabase.from('products').update({ status: 'inactive', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'name', label: 'Produto', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <Package size={16} className="text-teal-600" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-normal">{item.sku} · {item.category}</div>
        </div>
      </div>
    )},
    { key: 'company.name', label: 'Empresa', sortable: true, render: (item: any) => item.company?.name || '—' },
    { key: 'temp_range', label: 'Temperatura Ideal', render: (item: any) => `${item.temp_min} °C a ${item.temp_max} °C` },
    { key: 'humidity_range', label: 'Umidade Ideal', render: (item: any) => item.humidity_min ? `${item.humidity_min}% a ${item.humidity_max}%` : 'Não especificado' },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Ver Detalhes', icon: <Eye size={14} />, onClick: (item: any) => { setDetailsItem(item); setDetailsOpen(true) } },
    { label: 'Editar Produto', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
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
        setProducts(products.map(p => p.id === item.id ? { ...p, status: 'active' } : p))
        try { await supabase.from('products').update({ status: 'active' }).eq('id', item.id) } catch {}
      },
      hidden: (item: any) => item.status === 'active'
    }
  ]

  const filtered = products.filter(p => {
    if (filterCategory && p.category !== filterCategory) return false
    if (filterStatus && p.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Produtos Monitorados</h2>
          <p className="text-sm text-slate-500 mt-1">Catálogo de imunobiológicos, medicamentos e insumos com faixas críticas de conservação.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Produto
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por nome, SKU..."
        searchKeys={['name', 'sku', 'category']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Filtrar por Categoria">
              <Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="">Todas</option>
                <option value="Vacinas">Vacinas</option>
                <option value="Insulinas">Insulinas</option>
                <option value="Oncológicos">Oncológicos</option>
                <option value="Hemoderivados">Hemoderivados</option>
                <option value="Reagentes">Reagentes</option>
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
        title={editingItem ? 'Editar Produto' : 'Novo Produto'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Dados Gerais">
          <FormRow>
            <FormField label="Nome do Produto / Medicamento" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Vacina Contra Influenza"
              />
            </FormField>
            <FormField label="Código de Controle / SKU" required error={errors.sku}>
              <Input
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ex: VAC-INF-001"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Categoria do Produto">
              <Select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="Vacinas">Vacinas</option>
                <option value="Insulinas">Insulinas</option>
                <option value="Oncológicos">Oncológicos</option>
                <option value="Hemoderivados">Hemoderivados</option>
                <option value="Reagentes">Reagentes</option>
                <option value="Termolábeis Comuns">Termolábeis Comuns</option>
              </Select>
            </FormField>
            <FormField label="Empresa Vinculada" required error={errors.company_id}>
              <Select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                <option value="">Selecione...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Faixa e Conservação de Temperatura (GxP)">
          <FormRow>
            <FormField label="Temperatura Mínima Ideal (°C)">
              <Input
                type="number"
                step="0.5"
                value={formData.temp_min}
                onChange={e => setFormData({ ...formData, temp_min: e.target.value })}
                placeholder="Ex: 2.0"
              />
            </FormField>
            <FormField label="Temperatura Máxima Ideal (°C)">
              <Input
                type="number"
                step="0.5"
                value={formData.temp_max}
                onChange={e => setFormData({ ...formData, temp_max: e.target.value })}
                placeholder="Ex: 8.0"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Umidade Mínima Ideal (%)">
              <Input
                type="number"
                value={formData.humidity_min}
                onChange={e => setFormData({ ...formData, humidity_min: e.target.value })}
                placeholder="Ex: 35"
              />
            </FormField>
            <FormField label="Umidade Máxima Ideal (%)">
              <Input
                type="number"
                value={formData.humidity_max}
                onChange={e => setFormData({ ...formData, humidity_max: e.target.value })}
                placeholder="Ex: 65"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Condições Especiais">
          <FormField label="Instruções de Manuseio / Armazenagem">
            <Textarea
              value={formData.special_requirements}
              onChange={e => setFormData({ ...formData, special_requirements: e.target.value })}
              rows={3}
              placeholder="Ex: Proteger contra luz. Não agitar mecanicamente..."
            />
          </FormField>
        </FormSection>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Inativar Produto"
        description={`Deseja realmente inativar o produto ${deletingItem?.name}? Ele não poderá ser associado a novas rotas de transporte.`}
      />

      {/* Details View */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Detalhes de Ficha — ${detailsItem?.sku || ''}`}
        subtitle="Especificação técnica regulatória de Cadeia de Frio."
      >
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-medium">Nome Científico / Comercial:</span>
              <span className="font-bold text-slate-800">{detailsItem?.name}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Categoria Regulada:</span>
              <span className="font-bold text-slate-800">{detailsItem?.category}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Empresa:</span>
              <span className="font-bold text-slate-800">{detailsItem?.company?.name || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Status do Produto:</span>
              <span className="font-bold text-slate-800">
                <StatusBadge value={detailsItem?.status} />
              </span>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl">
            <h4 className="font-bold text-teal-800 text-sm mb-2">Padrão Regulatório de Conservação:</h4>
            <ul className="space-y-1 text-teal-900 text-xs">
              <li>🌡️ <strong>Temperatura de Armazenagem:</strong> {detailsItem?.temp_min} °C a {detailsItem?.temp_max} °C</li>
              <li>💧 <strong>Umidade Relativa do Ar:</strong> {detailsItem?.humidity_min || 35}% a {detailsItem?.humidity_max || 65}%</li>
            </ul>
          </div>

          {detailsItem?.special_requirements && (
            <div>
              <span className="block text-slate-400 font-bold mb-1">Alertas GxP de Manuseio:</span>
              <p className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs leading-relaxed font-semibold">
                ⚠️ {detailsItem?.special_requirements}
              </p>
            </div>
          )}
        </div>
      </FormModal>
    </div>
  )
}
