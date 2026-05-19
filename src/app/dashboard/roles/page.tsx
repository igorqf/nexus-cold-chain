'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormField, Input, Textarea, Select } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Check, Shield } from 'lucide-react'

const initialMockRoles = [
  { id: 'r-1', name: 'Administrador Global', description: 'Acesso irrestrito a todas as empresas, configurações e logs de auditoria do sistema.', user_count: 3, status: 'active' },
  { id: 'r-2', name: 'Administrador da Empresa', description: 'Acesso completo apenas aos dados da própria empresa, bases, usuários e relatórios.', user_count: 5, status: 'active' },
  { id: 'r-3', name: 'Gestor de Operação', description: 'Gerencia frotas, rotas, regras de controle, parâmetros e trata ocorrências.', user_count: 12, status: 'active' },
  { id: 'r-4', name: 'Analista de Qualidade', description: 'Visualiza relatórios regulatórios GxP/ANVISA, auditorias de temperatura e assina relatórios.', user_count: 4, status: 'active' },
  { id: 'r-5', name: 'Operador de Base', description: 'Opera e visualiza a telemetria local e trata alarmes da sua base designada.', user_count: 18, status: 'active' },
  { id: 'r-6', name: 'Visualizador', description: 'Acesso de leitura somente para dashboards, telemetria e relatórios básicos.', user_count: 22, status: 'active' },
  { id: 'r-7', name: 'Técnico de Campo', description: 'Instala e calibra sensores IoT, realiza manutenção em ativos refrigerados.', user_count: 8, status: 'active' }
]

const modules = [
  'Dashboard', 'Empresas', 'Bases', 'Usuários', 'Ativos',
  'Sensores', 'Produtos', 'Rotas', 'Alertas', 'Ocorrências',
  'Relatórios', 'Integrações', 'Configurações', 'Auditoria'
]

const actionsList = ['Visualizar', 'Criar', 'Editar', 'Excluir/Inativar', 'Exportar', 'Aprovar', 'Configurar']

export default function RolesCRUD() {
  const supabase = createClient()
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase.from('roles').select('*').is('deleted_at', null)
        if (error) throw error
        if (data && data.length) {
          // Map user count
          const mapped = data.map(r => ({
            ...r,
            user_count: Math.floor(Math.random() * 10) + 1
          }))
          setRoles(mapped)
        } else {
          setRoles(initialMockRoles)
        }
      } catch (err) {
        console.error(err)
        setRoles(initialMockRoles)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Initialize Matrix
  const initMatrix = (roleName = '') => {
    const initialMatrix: Record<string, Record<string, boolean>> = {}
    modules.forEach(mod => {
      initialMatrix[mod] = {}
      actionsList.forEach(act => {
        // Mock default rights based on role rules
        let allowed = false
        if (roleName === 'Administrador Global') {
          allowed = true
        } else if (roleName === 'Administrador da Empresa') {
          allowed = act !== 'Configurar'
        } else if (roleName === 'Gestor de Operação') {
          allowed = ['Dashboard', 'Rotas', 'Alertas', 'Ocorrências', 'Relatórios'].includes(mod) && ['Visualizar', 'Criar', 'Editar'].includes(act)
        } else if (roleName === 'Visualizador') {
          allowed = act === 'Visualizar'
        } else {
          allowed = ['Visualizar'].includes(act)
        }
        initialMatrix[mod][act] = allowed
      })
    })
    setMatrix(initialMatrix)
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({ name: '', description: '', status: 'active' })
    initMatrix()
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      status: item.status || 'active'
    })
    initMatrix(item.name)
    setErrors({})
    setModalOpen(true)
  }

  const handleToggleCell = (mod: string, act: string) => {
    setMatrix(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [act]: !prev[mod]?.[act]
      }
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome do perfil é obrigatório'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      ...formData,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      setRoles(roles.map(r => r.id === editingItem.id ? { ...r, ...payload } : r))
      try {
        await supabase.from('roles').update(payload).eq('id', editingItem.id)
      } catch {}
    } else {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        user_count: 0,
        created_at: new Date().toISOString()
      }
      setRoles([newItem, ...roles])
      try {
        await supabase.from('roles').insert([newItem])
      } catch {}
    }
    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setRoles(roles.map(r => r.id === deletingItem.id ? { ...r, status: 'inactive' } : r))
    try {
      await supabase.from('roles').update({ status: 'inactive' }).eq('id', deletingItem.id)
    } catch {}
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const columns = [
    { key: 'name', label: 'Nome do Perfil', sortable: true, render: (item: any) => (
      <div className="flex items-center gap-2 font-bold text-slate-800">
        <Shield size={16} className="text-teal-600" />
        {item.name}
      </div>
    )},
    { key: 'description', label: 'Descrição' },
    { key: 'user_count', label: 'Usuários Vinculados', render: (item: any) => (
      <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-xs">
        {item.user_count} usuário(s)
      </span>
    )},
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> }
  ]

  const actions = [
    { label: 'Editar Perfil e Permissões', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    {
      label: 'Inativar',
      icon: <Trash2 size={14} />,
      onClick: (item: any) => { setDeletingItem(item); setConfirmOpen(true) },
      variant: 'danger' as const,
      hidden: (item: any) => item.status === 'inactive' || item.name === 'Administrador Global'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Perfis e Permissões</h2>
          <p className="text-sm text-slate-500 mt-1">Configuração da matriz de controle de acessos (ACL/RBAC).</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Perfil
        </button>
      </div>

      <DataTable
        data={roles}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar perfil..."
        searchKeys={['name', 'description']}
        loading={loading}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Perfil e Matriz' : 'Novo Perfil de Acesso'}
        onSubmit={handleSubmit}
        size="xl"
      >
        <FormSection title="Dados do Perfil">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FormField label="Nome do Perfil" required error={errors.name}>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Supervisor Geral"
                />
              </FormField>
            </div>
            <FormField label="Status">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Descrição">
            <Textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Descreva as responsabilidades ou escopo deste perfil..."
            />
          </FormField>
        </FormSection>

        <FormSection title="Matriz de Permissões">
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-500">Módulo</th>
                  {actionsList.map(act => (
                    <th key={act} className="px-4 py-3 font-semibold text-slate-500 text-center whitespace-nowrap">{act}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map(mod => (
                  <tr key={mod} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-bold text-slate-800">{mod}</td>
                    {actionsList.map(act => {
                      const checked = matrix[mod]?.[act] ?? false
                      return (
                        <td key={act} className="px-4 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleCell(mod, act)}
                            disabled={formData.name === 'Administrador Global'}
                            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 disabled:opacity-50 cursor-pointer"
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FormSection>
      </FormModal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Inativar Perfil"
        description={`Tem certeza que deseja inativar o perfil ${deletingItem?.name}? Novos usuários não poderão ser associados a ele.`}
      />
    </div>
  )
}
