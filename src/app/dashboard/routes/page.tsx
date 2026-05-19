'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Eye, Route, Navigation, Play, CheckSquare } from 'lucide-react'

const initialMockRoutes = [
  {
    id: 'rt-1',
    name: 'Rota de Vacinas SP → RJ',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    asset_id: 'a-1',
    asset: { name: 'Caminhão Scania P320 Refr.', code: 'PLACA-ABC-1234' },
    origin_base_id: '22222222-0000-0000-0000-000000000001',
    origin_address: 'CD São Paulo - Guarulhos, SP',
    dest_base_id: '22222222-0000-0000-0000-000000000004',
    dest_address: 'CD Rio de Janeiro - Galeão, RJ',
    driver_name: 'Roberto Souza',
    driver_phone: '(11) 98888-2233',
    target_temp: 4.0,
    start_date: '2026-05-19T06:00:00Z',
    end_date: '2026-05-19T14:00:00Z',
    status: 'in_progress'
  },
  {
    id: 'rt-2',
    name: 'Distribuição Local BH - Insulinas',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    asset_id: 'a-3',
    asset: { name: 'Furgão Mercedes Sprinter', code: 'PLACA-XYZ-9876' },
    origin_base_id: '22222222-0000-0000-0000-000000000004',
    origin_address: 'CD Belo Horizonte, MG',
    dest_base_id: '',
    dest_address: 'Hospitais da Região Metropolitana, MG',
    driver_name: 'Cláudio Ferreira',
    driver_phone: '(31) 97777-6655',
    target_temp: 5.0,
    start_date: '2026-05-19T08:00:00Z',
    end_date: '2026-05-19T12:00:00Z',
    status: 'completed'
  },
  {
    id: 'rt-3',
    name: 'Carga de Importação Oncológicos',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    asset_id: 'a-2',
    asset: { name: 'Câmara Fria Primária SP', code: 'CAM-SP-01' },
    origin_base_id: '22222222-0000-0000-0000-000000000001',
    origin_address: 'Porto de Santos, SP',
    dest_base_id: '22222222-0000-0000-0000-000000000001',
    dest_address: 'CD São Paulo - Guarulhos, SP',
    driver_name: 'Carlos Antunes',
    driver_phone: '(11) 99999-5566',
    target_temp: -20.0,
    start_date: '2026-05-20T10:00:00Z',
    end_date: '2026-05-20T18:00:00Z',
    status: 'planned'
  }
]

export default function RoutesCRUD() {
  const supabase = createClient()
  const [routes, setRoutes] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
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
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company_id: '',
    asset_id: '',
    origin_base_id: '',
    origin_address: '',
    dest_base_id: '',
    dest_address: '',
    driver_name: '',
    driver_phone: '',
    target_temp: '4.0',
    start_date: '',
    end_date: '',
    status: 'planned'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [rRes, cRes, aRes, bRes] = await Promise.all([
          supabase.from('route_operations').select('*, companies(name), assets(name, code), origin_base:operational_bases!origin_base_id(name), dest_base:operational_bases!dest_base_id(name)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null),
          supabase.from('assets').select('id, name, code, company_id').is('deleted_at', null),
          supabase.from('operational_bases').select('id, name, company_id').is('deleted_at', null)
        ])

        const dbRoutes = rRes.data || []
        const dbCompanies = cRes.data || []
        const dbAssets = aRes.data || []
        const dbBases = bRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])
        setAssets(dbAssets.length ? dbAssets : [
          { id: 'a-1', name: 'Caminhão Scania P320 Refr.', code: 'PLACA-ABC-1234' },
          { id: 'a-2', name: 'Câmara Fria Primária SP', code: 'CAM-SP-01' },
          { id: 'a-3', name: 'Furgão Mercedes Sprinter', code: 'PLACA-XYZ-9876' }
        ])
        setBases(dbBases.length ? dbBases : [
          { id: '22222222-0000-0000-0000-000000000001', name: 'CD São Paulo - Guarulhos' },
          { id: '22222222-0000-0000-0000-000000000004', name: 'CD Belo Horizonte' }
        ])

        setRoutes(dbRoutes.length ? dbRoutes : initialMockRoutes)
      } catch (err) {
        console.error(err)
        setRoutes(initialMockRoutes)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome da rota é obrigatório'
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória'
    if (!formData.asset_id) newErrors.asset_id = 'Ativo refrigerado é obrigatório'
    if (!formData.origin_address.trim()) newErrors.origin_address = 'Endereço de origem é obrigatório'
    if (!formData.dest_address.trim()) newErrors.dest_address = 'Endereço de destino é obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      company_id: companies[0]?.id || '',
      asset_id: assets[0]?.id || '',
      origin_base_id: bases[0]?.id || '',
      origin_address: '',
      dest_base_id: '',
      dest_address: '',
      driver_name: '',
      driver_phone: '',
      target_temp: '4.0',
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 8*60*60*1000).toISOString().slice(0, 16),
      status: 'planned'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      company_id: item.company_id || '',
      asset_id: item.asset_id || '',
      origin_base_id: item.origin_base_id || '',
      origin_address: item.origin_address || '',
      dest_base_id: item.dest_base_id || '',
      dest_address: item.dest_address || '',
      driver_name: item.driver_name || '',
      driver_phone: item.driver_phone || '',
      target_temp: String(item.target_temp ?? '4.0'),
      start_date: item.start_date ? new Date(item.start_date).toISOString().slice(0, 16) : '',
      end_date: item.end_date ? new Date(item.end_date).toISOString().slice(0, 16) : '',
      status: item.status || 'planned'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedComp = companies.find(c => c.id === formData.company_id)
    const selectedAsset = assets.find(a => a.id === formData.asset_id)

    const payload = {
      ...formData,
      target_temp: parseFloat(formData.target_temp),
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      company: selectedComp ? { name: selectedComp.name } : null,
      asset: selectedAsset ? { name: selectedAsset.name, code: selectedAsset.code } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setRoutes(routes.map(r => r.id === editingItem.id ? { ...r, ...payload } : r))
      try {
        await supabase.from('route_operations').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        created_at: new Date().toISOString()
      }
      setRoutes([newItem, ...routes])
      try {
        await supabase.from('route_operations').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setRoutes(routes.map(r => r.id === deletingItem.id ? { ...r, status: 'cancelled', deleted_at: new Date().toISOString() } : r))
    try {
      await supabase.from('route_operations').update({ status: 'cancelled', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const handleStartRoute = async (item: any) => {
    setRoutes(routes.map(r => r.id === item.id ? { ...r, status: 'in_progress', start_date: new Date().toISOString() } : r))
    try {
      await supabase.from('route_operations').update({ status: 'in_progress', start_date: new Date().toISOString() }).eq('id', item.id)
    } catch {}
  }

  const handleCompleteRoute = async (item: any) => {
    setRoutes(routes.map(r => r.id === item.id ? { ...r, status: 'completed', end_date: new Date().toISOString() } : r))
    try {
      await supabase.from('route_operations').update({ status: 'completed', end_date: new Date().toISOString() }).eq('id', item.id)
    } catch {}
  }

  const columns = [
    { key: 'name', label: 'Operação / Rota', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <Route size={16} className="text-teal-600" />
        <div>
          <div>{item.name}</div>
          <div className="text-[10px] text-slate-400 font-normal">Motorista: {item.driver_name || '—'}</div>
        </div>
      </div>
    )},
    { key: 'asset.name', label: 'Ativo Refrigerado', sortable: true, render: (item: any) => item.asset ? (
      <div>
        <div className="font-semibold text-slate-700 text-xs">{item.asset.name}</div>
        <div className="text-[10px] text-slate-400 font-mono">{item.asset.code}</div>
      </div>
    ) : '—' },
    { key: 'route', label: 'Origem → Destino', render: (item: any) => (
      <div className="text-xs text-slate-600 font-semibold flex items-center gap-1">
        <Navigation size={12} className="text-slate-400 flex-shrink-0" />
        <span className="truncate max-w-[180px]">{item.origin_address} → {item.dest_address}</span>
      </div>
    )},
    { key: 'target_temp', label: 'Temp Alvo', render: (item: any) => `${item.target_temp || 4.0} °C` },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Ver Ficha de Rota', icon: <Eye size={14} />, onClick: (item: any) => { setDetailsItem(item); setDetailsOpen(true) } },
    { label: 'Iniciar Rota', icon: <Play size={14} className="text-emerald-600" />, onClick: handleStartRoute, hidden: (item: any) => item.status !== 'planned' },
    { label: 'Concluir Rota', icon: <CheckSquare size={14} className="text-blue-600" />, onClick: handleCompleteRoute, hidden: (item: any) => item.status !== 'in_progress' },
    { label: 'Editar Informações', icon: <Edit2 size={14} />, onClick: handleOpenEdit, hidden: (item: any) => item.status === 'completed' || item.status === 'cancelled' },
    {
      label: 'Cancelar Operação',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'completed' || item.status === 'cancelled'
    }
  ]

  const filtered = routes.filter(r => {
    if (filterCompany && r.company_id !== filterCompany) return false
    if (filterStatus && r.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestão de Rotas e Distribuição</h2>
          <p className="text-sm text-slate-500 mt-1">Planejamento, monitoramento térmico em trânsito e finalização de entregas.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Rota
        </button>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por motorista, rota..."
        searchKeys={['name', 'driver_name', 'origin_address', 'dest_address']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Empresa">
              <Select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                <option value="">Todas</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Status Operação">
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="planned">Planejada</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="cancelled">Cancelada</option>
              </Select>
            </FormField>
          </div>
        }
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Planejamento' : 'Novo Planejamento de Rota'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Escopo Operacional">
          <FormRow>
            <FormField label="Nome da Rota / ID Viagem" required error={errors.name}>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Entrega Vacinas - Lote 54"
              />
            </FormField>
            <FormField label="Empresa Responsável" required error={errors.company_id}>
              <Select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                <option value="">Selecione...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Ativo Refrigerado" required error={errors.asset_id}>
              <Select value={formData.asset_id} onChange={e => setFormData({ ...formData, asset_id: e.target.value })}>
                <option value="">Selecione o veículo/câmara...</option>
                {assets.filter(a => !formData.company_id || a.company_id === formData.company_id).map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Temperatura de Carga Alvo (°C)">
              <Input
                type="number"
                step="0.5"
                value={formData.target_temp}
                onChange={e => setFormData({ ...formData, target_temp: e.target.value })}
                placeholder="Ex: 4.0"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Trajeto / Roteirização">
          <FormRow>
            <FormField label="Base de Origem (Opcional)">
              <Select value={formData.origin_base_id} onChange={e => setFormData({ ...formData, origin_base_id: e.target.value })}>
                <option value="">Sem base fixa (Endereço livre)</option>
                {bases.filter(b => !formData.company_id || b.company_id === formData.company_id).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Endereço de Partida" required error={errors.origin_address}>
              <Input
                value={formData.origin_address}
                onChange={e => setFormData({ ...formData, origin_address: e.target.value })}
                placeholder="Rua, Cidade, UF"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Base de Destino (Opcional)">
              <Select value={formData.dest_base_id} onChange={e => setFormData({ ...formData, dest_base_id: e.target.value })}>
                <option value="">Sem base fixa (Endereço livre)</option>
                {bases.filter(b => !formData.company_id || b.company_id === formData.company_id).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </FormField>
            <FormField label="Endereço de Chegada / Cliente" required error={errors.dest_address}>
              <Input
                value={formData.dest_address}
                onChange={e => setFormData({ ...formData, dest_address: e.target.value })}
                placeholder="Rua, Cidade, UF"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Motorista e Cronograma">
          <FormRow>
            <FormField label="Nome do Motorista">
              <Input
                value={formData.driver_name}
                onChange={e => setFormData({ ...formData, driver_name: e.target.value })}
                placeholder="Nome do motorista"
              />
            </FormField>
            <FormField label="Celular do Motorista">
              <Input
                value={formData.driver_phone}
                onChange={e => setFormData({ ...formData, driver_phone: e.target.value })}
                placeholder="(00) 90000-0000"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Previsão de Partida">
              <Input
                type="datetime-local"
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              />
            </FormField>
            <FormField label="Previsão de Chegada">
              <Input
                type="datetime-local"
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
              />
            </FormField>
          </FormRow>
          <FormField label="Status Operacional">
            <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="planned">Planejada / Aguardando</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluída</option>
              <option value="cancelled">Cancelada</option>
            </Select>
          </FormField>
        </FormSection>
      </FormModal>

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Cancelar Viagem"
        description={`Deseja realmente cancelar a rota ${deletingItem?.name}? Essa ação é registrada no histórico de segurança.`}
      />

      {/* Details View */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Detalhamento de Viagem — ${detailsItem?.name || ''}`}
        subtitle="Registro em trânsito com telemetria ativa."
      >
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-medium">Veículo / Câmara:</span>
              <span className="font-bold text-slate-800">{detailsItem?.asset?.name || '—'} ({detailsItem?.asset?.code})</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Motorista:</span>
              <span className="font-bold text-slate-800">{detailsItem?.driver_name || '—'} ({detailsItem?.driver_phone})</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Início Real/Previsto:</span>
              <span className="font-bold text-slate-800">{detailsItem?.start_date ? new Date(detailsItem.start_date).toLocaleString() : '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Término Real/Previsto:</span>
              <span className="font-bold text-slate-800">{detailsItem?.end_date ? new Date(detailsItem.end_date).toLocaleString() : '—'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Rota:</h4>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Origem</span>
                <span className="text-sm font-semibold text-slate-700">{detailsItem?.origin_address}</span>
              </div>
              <div className="border-t border-slate-150 pt-2.5">
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Destino</span>
                <span className="text-sm font-semibold text-slate-700">{detailsItem?.dest_address}</span>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
