'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import FormModal, { FormSection, FormRow, FormField, Input, Select, Textarea } from '@/components/ui/FormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Plus, Edit2, Trash2, Key, Eye, Check } from 'lucide-react'

const initialMockUsers = [
  {
    id: 'u-1',
    full_name: 'Igor Quadros',
    email: 'igor.quadros@aguiabranca.com.br',
    phone: '(27) 99999-9999',
    cpf: '123.456.789-00',
    company_id: '11111111-0000-0000-0000-000000000001',
    company: { name: 'Nexus Logística Vital' },
    base_id: '22222222-0000-0000-0000-000000000001',
    base: { name: 'CD São Paulo - Guarulhos' },
    role_id: '33333333-0000-0000-0000-000000000001',
    role: { name: 'Administrador Global' },
    status: 'active',
    allow_web: true,
    allow_mobile: true,
    last_access: '19/05/2026 13:42',
    notes: 'Usuário principal de testes'
  },
  {
    id: 'u-2',
    full_name: 'Ana Souza',
    email: 'ana.souza@farma.com',
    phone: '(11) 98888-7777',
    cpf: '987.654.321-11',
    company_id: '11111111-0000-0000-0000-000000000003',
    company: { name: 'FarmaCool Distribuidora' },
    base_id: '22222222-0000-0000-0000-000000000004',
    base: { name: 'CD Belo Horizonte' },
    role_id: '33333333-0000-0000-0000-000000000002',
    role: { name: 'Gestor de Operação' },
    status: 'active',
    allow_web: true,
    allow_mobile: false,
    last_access: '18/05/2026 09:15',
    notes: ''
  }
]

export default function UsersCRUD() {
  const supabase = createClient()
  const [users, setUsers] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [bases, setBases] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<any>(null)
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false)
  const [viewingUser, setViewingUser] = useState<any>(null)

  // Filters state
  const [filterCompany, setFilterCompany] = useState('')
  const [filterBase, setFilterBase] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cpf: '',
    company_id: '',
    base_id: '',
    role_id: '',
    status: 'active',
    allow_web: true,
    allow_mobile: false,
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      try {
        const [uRes, cRes, bRes, rRes] = await Promise.all([
          supabase.from('users_profiles').select('*, companies(name), operational_bases(name), roles(name)').is('deleted_at', null),
          supabase.from('companies').select('id, name').is('deleted_at', null),
          supabase.from('operational_bases').select('id, name, company_id').is('deleted_at', null),
          supabase.from('roles').select('id, name').is('deleted_at', null)
        ])

        const dbUsers = uRes.data || []
        const dbCompanies = cRes.data || []
        const dbBases = bRes.data || []
        const dbRoles = rRes.data || []

        setCompanies(dbCompanies.length ? dbCompanies : [
          { id: '11111111-0000-0000-0000-000000000001', name: 'Nexus Logística Vital' },
          { id: '11111111-0000-0000-0000-000000000002', name: 'Aguia Branca Transportes' },
          { id: '11111111-0000-0000-0000-000000000003', name: 'FarmaCool Distribuidora' }
        ])
        setBases(dbBases.length ? dbBases : [
          { id: '22222222-0000-0000-0000-000000000001', name: 'CD São Paulo - Guarulhos' },
          { id: '22222222-0000-0000-0000-000000000004', name: 'CD Belo Horizonte' }
        ])
        setRoles(dbRoles.length ? dbRoles : [
          { id: '33333333-0000-0000-0000-000000000001', name: 'Administrador Global' },
          { id: '33333333-0000-0000-0000-000000000002', name: 'Gestor de Operação' }
        ])

        // Fallback to mock data if empty
        setUsers(dbUsers.length ? dbUsers : initialMockUsers)
      } catch (err) {
        console.error(err)
        setUsers(initialMockUsers)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.full_name.trim()) newErrors.full_name = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido'
    if (!formData.company_id) newErrors.company_id = 'Empresa é obrigatória'
    if (!formData.role_id) newErrors.role_id = 'Perfil de acesso é obrigatório'

    const emailDup = users.some(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== editingItem?.id)
    if (emailDup) newErrors.email = 'E-mail já está em uso'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      cpf: '',
      company_id: companies[0]?.id || '',
      base_id: bases[0]?.id || '',
      role_id: roles[0]?.id || '',
      status: 'active',
      allow_web: true,
      allow_mobile: false,
      notes: ''
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      full_name: item.full_name || '',
      email: item.email || '',
      phone: item.phone || '',
      cpf: item.cpf || '',
      company_id: item.company_id || '',
      base_id: item.base_id || '',
      role_id: item.role_id || '',
      status: item.status || 'active',
      allow_web: !!item.allow_web,
      allow_mobile: !!item.allow_mobile,
      notes: item.notes || ''
    })
    setErrors({})
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedComp = companies.find(c => c.id === formData.company_id)
    const selectedBase = bases.find(b => b.id === formData.base_id)
    const selectedRole = roles.find(r => r.id === formData.role_id)

    const payload = {
      ...formData,
      company: selectedComp ? { name: selectedComp.name } : null,
      base: selectedBase ? { name: selectedBase.name } : null,
      role: selectedRole ? { name: selectedRole.name } : null,
      updated_at: new Date().toISOString()
    }

    if (editingItem) {
      // Update
      setUsers(users.map(u => u.id === editingItem.id ? { ...u, ...payload } : u))
      // Try DB
      try {
        await supabase.from('users_profiles').update(payload).eq('id', editingItem.id)
      } catch (err) {
        console.error(err)
      }
    } else {
      // Create
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        created_at: new Date().toISOString(),
        last_access: '—'
      }
      setUsers([newItem, ...users])
      // Try DB
      try {
        await supabase.from('users_profiles').insert([newItem])
      } catch (err) {
        console.error(err)
      }
    }

    setModalOpen(false)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return
    setUsers(users.map(u => u.id === deletingItem.id ? { ...u, status: 'inactive', deleted_at: new Date().toISOString() } : u))
    try {
      await supabase.from('users_profiles').update({ status: 'inactive', deleted_at: new Date().toISOString() }).eq('id', deletingItem.id)
    } catch (err) {
      console.error(err)
    }
    setConfirmOpen(false)
    setDeletingItem(null)
  }

  const handleResetPassword = (item: any) => {
    alert(`Uma solicitação de reset de senha foi enviada para ${item.email}`)
  }

  const columns = [
    { key: 'full_name', label: 'Nome', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
    { key: 'phone', label: 'Telefone' },
    { key: 'company.name', label: 'Empresa', sortable: true, render: (item: any) => item.company?.name || '—' },
    { key: 'base.name', label: 'Base', sortable: true, render: (item: any) => item.base?.name || '—' },
    { key: 'role.name', label: 'Perfil', sortable: true, render: (item: any) => item.role?.name || '—' },
    { key: 'status', label: 'Status', render: (item: any) => <StatusBadge value={item.status} /> },
    { key: 'last_access', label: 'Último Acesso' }
  ]

  const actions = [
    { label: 'Editar', icon: <Edit2 size={14} />, onClick: handleOpenEdit },
    { label: 'Resetar Senha', icon: <Key size={14} />, onClick: handleResetPassword },
    { label: 'Visualizar Permissões', icon: <Eye size={14} />, onClick: (item: any) => { setViewingUser(item); setPermissionsModalOpen(true) } },
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
        setUsers(users.map(u => u.id === item.id ? { ...u, status: 'active' } : u))
        try { await supabase.from('users_profiles').update({ status: 'active' }).eq('id', item.id) } catch {}
      },
      hidden: (item: any) => item.status === 'active'
    }
  ]

  const filteredUsers = users.filter(u => {
    if (filterCompany && u.company_id !== filterCompany) return false
    if (filterBase && u.base_id !== filterBase) return false
    if (filterRole && u.role_id !== filterRole) return false
    if (filterStatus && u.status !== filterStatus) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Gestão de Usuários</h2>
          <p className="text-sm text-slate-500 mt-1">Controle de acessos, permissões e perfis dos usuários da plataforma.</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Novo Usuário
        </button>
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        actions={actions}
        searchPlaceholder="Buscar por nome ou e-mail..."
        searchKeys={['full_name', 'email']}
        loading={loading}
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <FormField label="Filtrar por Empresa">
              <Select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}>
                <option value="">Todas</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Filtrar por Base">
              <Select value={filterBase} onChange={e => setFilterBase(e.target.value)}>
                <option value="">Todas</option>
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Filtrar por Perfil">
              <Select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                <option value="">Todos</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Filtrar por Status">
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </Select>
            </FormField>
          </div>
        }
      />

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Editar Usuário' : 'Novo Usuário'}
        subtitle="Preencha os campos abaixo para cadastrar ou atualizar o usuário."
        onSubmit={handleSubmit}
      >
        <FormSection title="Dados Gerais">
          <FormField label="Nome Completo" required error={errors.full_name}>
            <Input
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Digite o nome completo"
            />
          </FormField>
          <FormRow>
            <FormField label="E-mail" required error={errors.email}>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="exemplo@email.com"
              />
            </FormField>
            <FormField label="Telefone">
              <Input
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </FormField>
          </FormRow>
          <FormRow>
            <FormField label="CPF ou ID Interno">
              <Input
                value={formData.cpf}
                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </FormField>
            <FormField label="Status">
              <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="pending">Pendente</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Vínculos e Permissões">
          <FormRow>
            <FormField label="Empresa Vinculada" required error={errors.company_id}>
              <Select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                <option value="">Selecione...</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Base Operacional">
              <Select value={formData.base_id} onChange={e => setFormData({ ...formData, base_id: e.target.value })}>
                <option value="">Nenhuma (Acesso Geral)</option>
                {bases.filter(b => !formData.company_id || b.company_id === formData.company_id).map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </FormField>
          </FormRow>
          <FormField label="Perfil de Acesso" required error={errors.role_id}>
            <Select value={formData.role_id} onChange={e => setFormData({ ...formData, role_id: e.target.value })}>
              <option value="">Selecione...</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </FormField>
        </FormSection>

        <FormSection title="Canais de Acesso">
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.allow_web}
                onChange={e => setFormData({ ...formData, allow_web: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              Permitir Acesso Web (Portal)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
              <input
                type="checkbox"
                checked={formData.allow_mobile}
                onChange={e => setFormData({ ...formData, allow_mobile: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              Permitir Acesso Mobile (App)
            </label>
          </div>
        </FormSection>

        <FormSection title="Informações Adicionais">
          <FormField label="Observações">
            <Textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Notas adicionais sobre o usuário..."
            />
          </FormField>
        </FormSection>
      </FormModal>

      {/* Confirm Inactivate Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Inativar Usuário"
        description={`Tem certeza que deseja inativar o acesso de ${deletingItem?.full_name}?`}
      />

      {/* Permissions View Modal */}
      <FormModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        title={`Matriz de Permissões — ${viewingUser?.full_name || ''}`}
        subtitle={`Perfil: ${viewingUser?.role?.name || ''}`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-2">Visão Geral das Regras:</h4>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
              <li><strong>Administrador Global:</strong> Acesso total a todos os recursos da plataforma.</li>
              <li><strong>Administrador da Empresa:</strong> Acesso irrestrito restrito aos dados de sua empresa.</li>
              <li><strong>Gestor de Operação:</strong> Visualiza e edita rotas, alertas e ocorrencias. Relatórios liberados.</li>
            </ul>
          </div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-xs font-semibold uppercase">
                <th className="py-2 text-left">Módulo</th>
                <th className="py-2 text-center">Visualizar</th>
                <th className="py-2 text-center">Criar</th>
                <th className="py-2 text-center">Editar</th>
                <th className="py-2 text-center">Inativar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {['Dashboard', 'Empresas', 'Bases', 'Usuários', 'Ativos', 'Sensores', 'Rotas', 'Alertas'].map(mod => (
                <tr key={mod}>
                  <td className="py-2 font-medium">{mod}</td>
                  <td className="py-2 text-center">✅</td>
                  <td className="py-2 text-center">{viewingUser?.role?.name === 'Visualizador' ? '❌' : '✅'}</td>
                  <td className="py-2 text-center">{viewingUser?.role?.name === 'Visualizador' ? '❌' : '✅'}</td>
                  <td className="py-2 text-center">{['Visualizador', 'Operador'].includes(viewingUser?.role?.name) ? '❌' : '✅'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormModal>
    </div>
  )
}
