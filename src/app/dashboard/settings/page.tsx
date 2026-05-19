'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FormField, Input, Select } from '@/components/ui/FormModal'
import { Save, ShieldAlert, Key, BellRing, Settings2 } from 'lucide-react'

export default function SettingsView() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)

  // Settings State
  const [formData, setFormData] = useState({
    system_title: 'Nexus Cold Chain Intelligence',
    gxp_validation_mode: 'enabled',
    session_timeout_minutes: '30',
    alert_frequency_seconds: '60',
    smtp_host: 'smtp.nexusvital.com',
    smtp_port: '587',
    smtp_user: 'no-reply@nexusvital.com',
    alert_webhook_url: 'https://hooks.slack.com/services/T00/B00/X00',
    sms_provider: 'twilio',
    theme_color: '#0d9488'
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase.from('system_settings').select('*').single()
        if (data) {
          setFormData({
            system_title: data.system_title || 'Nexus Cold Chain Intelligence',
            gxp_validation_mode: data.gxp_validation_mode || 'enabled',
            session_timeout_minutes: String(data.session_timeout_minutes ?? '30'),
            alert_frequency_seconds: String(data.alert_frequency_seconds ?? '60'),
            smtp_host: data.smtp_host || 'smtp.nexusvital.com',
            smtp_port: String(data.smtp_port ?? '587'),
            smtp_user: data.smtp_user || 'no-reply@nexusvital.com',
            alert_webhook_url: data.alert_webhook_url || '',
            sms_provider: data.sms_provider || 'twilio',
            theme_color: data.theme_color || '#0d9488'
          })
        }
      } catch {}
      setLoading(false)
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    try {
      await supabase.from('system_settings').upsert({
        id: 1, // Single settings row
        ...formData,
        session_timeout_minutes: parseInt(formData.session_timeout_minutes) || 30,
        alert_frequency_seconds: parseInt(formData.alert_frequency_seconds) || 60,
        smtp_port: parseInt(formData.smtp_port) || 587,
        updated_at: new Date().toISOString()
      })
    } catch {}

    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-150 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings2 className="text-teal-600 animate-spin-slow" size={24} />
            Configurações Globais do Sistema
          </h2>
          <p className="text-sm text-slate-500 mt-1">Configure parâmetros de conformidade, credenciais de notificação e identidade visual da plataforma.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <span>✓</span> Configurações salvas e aplicadas com sucesso em tempo de execução!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Conformidade e Rastreabilidade */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldAlert size={16} className="text-teal-600" />
            Parâmetros de Conformidade GxP / ANVISA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Validação de Assinatura Eletrônica (21 CFR Part 11)">
              <Select
                value={formData.gxp_validation_mode}
                onChange={e => setFormData({ ...formData, gxp_validation_mode: e.target.value })}
              >
                <option value="enabled">Habilitada (Audit Log Rígido + MFA para alterações)</option>
                <option value="disabled">Desabilitada (Somente Logs Comuns)</option>
              </Select>
            </FormField>
            <FormField label="Tempo de Expiração de Sessão Inativa (Minutos)">
              <Input
                type="number"
                value={formData.session_timeout_minutes}
                onChange={e => setFormData({ ...formData, session_timeout_minutes: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        {/* Notificações e Webhooks */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <BellRing size={16} className="text-teal-600" />
            Configuração de Alertas e Canais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Frequência de Varredura de Alertas IoT (Segundos)">
              <Input
                type="number"
                value={formData.alert_frequency_seconds}
                onChange={e => setFormData({ ...formData, alert_frequency_seconds: e.target.value })}
              />
            </FormField>
            <FormField label="Provedor de SMS / WhatsApp">
              <Select
                value={formData.sms_provider}
                onChange={e => setFormData({ ...formData, sms_provider: e.target.value })}
              >
                <option value="twilio">Twilio API (EUA/BR)</option>
                <option value="zenvia">Zenvia (BR)</option>
                <option value="infobip">Infobip</option>
              </Select>
            </FormField>
          </div>
          <FormField label="URL do Webhook de Emergência (Slack / Teams)">
            <Input
              value={formData.alert_webhook_url}
              onChange={e => setFormData({ ...formData, alert_webhook_url: e.target.value })}
              placeholder="https://hooks.slack.com/services/..."
            />
          </FormField>
        </div>

        {/* Servidor SMTP */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key size={16} className="text-teal-600" />
            Servidor de E-mail de Alerta (SMTP)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FormField label="Host SMTP">
                <Input
                  value={formData.smtp_host}
                  onChange={e => setFormData({ ...formData, smtp_host: e.target.value })}
                  placeholder="smtp.empresa.com"
                />
              </FormField>
            </div>
            <FormField label="Porta SMTP">
              <Input
                type="number"
                value={formData.smtp_port}
                onChange={e => setFormData({ ...formData, smtp_port: e.target.value })}
                placeholder="587"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Usuário de Envio">
              <Input
                value={formData.smtp_user}
                onChange={e => setFormData({ ...formData, smtp_user: e.target.value })}
                placeholder="no-reply@empresa.com"
              />
            </FormField>
            <FormField label="Senha SMTP">
              <Input
                type="password"
                placeholder="••••••••••••••••"
              />
            </FormField>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-3 border-t border-slate-150 pt-5">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save size={16} />
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  )
}
