'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Eye, Cpu, Calendar } from 'lucide-react'

const initialMockSensors = [
  {
    id: 's-1',
    serial_number: 'SN-TEMP-9988',
    model: 'ColdGuard Pro v2',
    type: 'Temperatura/Umidade',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    asset_id: 'a-1',
    asset: { name: 'Caminhão Scania P320 Refr.', code: 'PLACA-ABC-1234' },
    battery_level: 94,
    frequency_seconds: 60,
    last_calibration: '2026-01-10',
    calibration_due: '2027-01-10',
    last_reading: '19/05/2026 14:20 · 4.8 °C / 55%',
    status: 'online'
  },
  {
    id: 's-2',
    serial_number: 'SN-TEMP-1102',
    model: 'SenseTherm RF-800',
    type: 'Temperatura',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    asset_id: 'a-2',
    asset: { name: 'Câmara Fria Primária SP', code: 'CAM-SP-01' },
    battery_level: 100, // plugged
    frequency_seconds: 30,
    last_calibration: '2026-02-15',
    calibration_due: '2027-02-15',
    last_reading: '19/05/2026 14:21 · -18.2 °C',
    status: 'online'
  },
  {
    id: 's-3',
    serial_number: 'SN-GPS-4455',
    model: 'LocateIntel GPS/Cellular',
    type: 'Localização/GPS',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    asset_id: 'a-3',
    asset: { name: 'Furgão Mercedes Sprinter', code: 'PLACA-XYZ-9876' },
    battery_level: 12,
    frequency_seconds: 300,
    last_calibration: '2025-11-20',
    calibration_due: '2026-11-20',
    last_reading: '19/05/2026 14:18 · Lat: -23.5505, Lon: -46.6333',
    status: 'no_comm'
  }
]

export default function SensorsCRUD() {
  const supabase = createClient()
  const [sensors, setSensors] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsItem, setDetailsItem] = useState<any>(null)

  // Filters
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    serial_number: '',
    model: '',
    type: 'Temperatura',
    company_id: '',
    asset_id: '',
    battery_level: '100',
    frequency_seconds: '60',
    last_calibration: '',
    calibration_due: '',
    status: 'online'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [sRes, cRes, aRes] = await Promise.all([
          supabase.from('iot_sensors').select('*, companies(name), assets(name, code)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null),
          supabase.from('assets').select('id, name, code, company_id').is('deleted_at', null)
        ])

        const dbSensors = sRes.data || []
        const dbCompanies = cRes.data || []
        const dbAssets = aRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])
        setAssets(dbAssets.length ? dbAssets : [
          { id: 'a-1', name: 'Caminhão Scania P320 Refr.', code: 'PLACA-ABC-1234' },
          { id: 'a-2', name: 'Câmara Fria Primária SP', code: 'CAM-SP-01' },
          { id: 'a-3', name: 'Furgão Mercedes Sprinter', code: 'PLACA-XYZ-9876' }
        ])

        setSensors(dbSensors.length ? dbSensors : initialMockSensors)
      } catch (err) {
        console.error(err)
        setSensors(initialMockSensors)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.serial_number.trim()) newErrors.serial_number = 'Número de Série é obrigatório'
    if (!formData.model.trim()) newErrors.model = 'Modelo do dispositivo é obrigatório'
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      serial_number: '',
      model: '',
      type: 'Temperatura',
      company_id: companies[0]?.id || '',
      asset_id: '',
      battery_level: '100',
      frequency_seconds: '60',
      last_calibration: new Date().toISOString().split('T')[0],
      calibration_due: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      status: 'online'
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      serial_number: item.serial_number || '',
      model: item.model || '',
      type: item.type || 'Temperatura',
      company_id: item.company_id || '',
      asset_id: item.asset_id || '',
      battery_level: String(item.battery_level ?? '100'),
      frequency_seconds: String(item.frequency_seconds ?? '60'),
      last_calibration: item.last_calibration || '',
      calibration_due: item.calibration_due || '',
      status: item.status || 'online'
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
      battery_level: parseInt(formData.battery_level),
      frequency_seconds: parseInt(formData.frequency_seconds),
      company: selectedComp ? { name: selectedComp.name } : null,
      asset: selectedAsset ? { name: selectedAsset.name, code: selectedAsset.code } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setSensors(sensors.map(s => s.id === editingItem.id ? { ...s, ...payload } : s))
      try {
        await supabase.from('iot_sensors').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        last_reading: 'Sem leitura recente',
        created_at: new Date().toISOString()
      }
      setSensors([newItem, ...sensors])
      try {
        await supabase.from('iot_sensors').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setSensors(sensors.map(s => s.id === deletingItem.id ? { ...s, status: 'offline', deleted_at: new Date().toISOString() } : s))
    try {
      await supabase.from('iot_sensors').update({ status: 'offline', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'serial_number', label: 'Número de Série / MAC', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2.5 font-bold text-slate-800">
        <Cpu size={16} className="text-teal-600 animate-pulse" />
        <div>
          <div className="font-mono text-xs text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded inline-block">{item.serial_number}</div>
          <div className="text-[10px] text-slate-400 font-normal mt-0.5">{item.model}</div>
        </div>
      </div>
    )},
    { key: 'type', label: 'Tipo', sortable: true },
    { key: 'asset.name', label: 'Ativo Vinculado', sortable: true, render: (item: any) => item.asset ? (
      <div>
        <div className="font-semibold text-slate-700 text-xs">{item.asset.name}</div>
        <div className="text-[10px] text-slate-400 font-mono">{item.asset.code}</div>
      </div>
    ) : <span className="text-slate-400 italic">Desvinculado</span> },
    { key: 'battery_level', label: 'Bateria', render: (item: any) => (
      <span className={`font-bold ${item.battery_level <= 15 ? 'text-red-500 animate-bounce' : 'text-slate-700'}`}>
        {item.battery_level}% {item.battery_level >= 100 ? '🔌' : ''}
      </span>
    )},
    { key: 'last_reading', label: 'Última Transmissão', render: (item: any) => (
      <div className="max-w-[200px] truncate text-xs text-slate-500 font-medium" title={item.last_reading}>
        {item.last_reading}
      </div>
    )},
    { key: 'status', label: 'Status Comunicação', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Ver Detalhes e Calibração', icon: <Eye size={14} />, onClick: (item: any) => { setDetailsItem(item); setDetailsOpen(true) } },
    { label: 'Editar Sensor', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    {
      label: 'Remover / Desativar',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'offline'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sensores e Dispositivos IoT</h2>
          <p className="text-sm text-slate-500 mt-1">Dispositivos de telemetria contínua de temperatura, umidade e rastreamento GPS.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Sensor
        </button>
      </div>

      <DataTable
        data={sensors}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por serial, modelo..."
        searchKeys={['serial_number', 'model', 'type']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Filtrar por Tipo">
              <Select value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">Todos</option>
                <option value="Temperatura">Temperatura</option>
                <option value="Temperatura/Umidade">Temperatura e Umidade</option>
                <option value="Localização/GPS">Localização/GPS</option>
              </Select>
            </FormField>
            <FormField label="Status Comunicação">
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="online">Online</option>
                <option value="no_comm">Sem Comunicação</option>
                <option value="offline">Inativo</option>
              </Select>
            </FormField>
          </div>
        }
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Sensor IoT' : 'Novo Sensor IoT'}
        onSubmit={handleSubmit}
        size="lg"
      >
        <FormSection title="Dados Gerais do Dispositivo">
          <FormRow>
            <FormField label="Número de Série (Serial / MAC)" required error={errors.serial_number}>
              <Input
                value={formData.serial_number}
                onChange={e => setFormData({ ...formData, serial_number: e.target.value })}
                placeholder="Ex: SN-TEMP-9988"
              />
            </FormField>
            <FormField label="Modelo / Fabricante" required error={errors.model}>
              <Input
                value={formData.model}
                onChange={e => setFormData({ ...formData, model: e.target.value })}
                placeholder="Ex: ColdGuard Pro v2"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Tipo de Telemetria">
              <Select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                <option value="Temperatura">Temperatura</option>
                <option value="Temperatura/Umidade">Temperatura/Umidade</option>
                <option value="Localização/GPS">Localização/GPS</option>
                <option value="Abertura de Porta">Abertura de Porta</option>
              </Select>
            </FormField>
            <FormField label="Status de Operação">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="online">Online / Ativo</option>
                <option value="no_comm">Sem Comunicação</option>
                <option value="offline">Inativo</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Vínculos e Frequência">
          <FormRow>
            <FormField label="Empresa Detentora" required error={errors.company_id}>
              <Select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                <option value="">Selecione...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Ativo para Vinculação (Opcional)">
              <Select value={formData.asset_id} onChange={e => setFormData({ ...formData, asset_id: e.target.value })}>
                <option value="">Nenhum ativo vinculado</option>
                {assets.filter(a => !formData.company_id || a.company_id === formData.company_id).map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.code})</option>
                ))}
              </Select>
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="Frequência de Envio (segundos)">
              <Input
                type="number"
                value={formData.frequency_seconds}
                onChange={e => setFormData({ ...formData, frequency_seconds: e.target.value })}
                placeholder="Ex: 60"
              />
            </FormField>
            <FormField label="Nível da Bateria (%)">
              <Input
                type="number"
                value={formData.battery_level}
                onChange={e => setFormData({ ...formData, battery_level: e.target.value })}
                placeholder="Ex: 100"
              />
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Controle de Calibração (GxP / ANVISA)">
          <FormRow>
            <FormField label="Última Calibração">
              <Input
                type="date"
                value={formData.last_calibration}
                onChange={e => setFormData({ ...formData, last_calibration: e.target.value })}
              />
            </FormField>
            <FormField label="Próxima Calibração (Vencimento)">
              <Input
                type="date"
                value={formData.calibration_due}
                onChange={e => setFormData({ ...formData, calibration_due: e.target.value })}
              />
            </FormField>
          </FormRow>
        </FormSection>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Desativar Sensor"
        description={`Tem certeza que deseja inativar o sensor ${deletingItem?.serial_number}? A coleta automática de telemetria deste dispositivo será suspensa.`}
      />

      {/* Details View */}
      <FormModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Histórico de Calibração — ${detailsItem?.serial_number || ''}`}
        subtitle="Verificação metrológica periódica (Cadeia de Frio Farmacêutica)."
      >
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-medium">Modelo do Equipamento:</span>
              <span className="font-bold text-slate-800">{detailsItem?.model || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Tipo de Sensor:</span>
              <span className="font-bold text-slate-800">{detailsItem?.type || '—'}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Frequência de Registro:</span>
              <span className="font-bold text-slate-800">A cada {detailsItem?.frequency_seconds} segundos</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Nível Bateria:</span>
              <span className="font-bold text-teal-600">{detailsItem?.battery_level}%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
              <Calendar size={16} className="text-teal-600" />
              Laudos de Calibração (GxP)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-150">
                <div>
                  <span className="block text-xs font-semibold text-slate-700">Última Inspeção Metrológica</span>
                  <span className="text-[10px] text-slate-400">Em conformidade com padrão RBC (Rede Brasileira de Calibração)</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600">{detailsItem?.last_calibration}</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-150">
                <div>
                  <span className="block text-xs font-semibold text-slate-700">Vencimento da Calibração</span>
                  <span className="text-[10px] text-slate-400">Intervalo máximo sugerido: 12 meses</span>
                </div>
                <span className="font-mono text-xs font-bold text-red-600">{detailsItem?.calibration_due}</span>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
