'use client'

const variants: Record<string, string> = {
  // Status
  active:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive:  'bg-slate-100 text-slate-600 border-slate-200',
  pending:   'bg-amber-100 text-amber-700 border-amber-200',
  // Severity
  critical:  'bg-red-100 text-red-700 border-red-200',
  warning:   'bg-amber-100 text-amber-700 border-amber-200',
  info:      'bg-blue-100 text-blue-700 border-blue-200',
  low:       'bg-slate-100 text-slate-600 border-slate-200',
  // Operational
  online:         'bg-emerald-100 text-emerald-700 border-emerald-200',
  offline:        'bg-red-100 text-red-700 border-red-200',
  maintenance:    'bg-amber-100 text-amber-700 border-amber-200',
  in_operation:   'bg-blue-100 text-blue-700 border-blue-200',
  no_comm:        'bg-rose-100 text-rose-700 border-rose-200',
  blocked:        'bg-slate-200 text-slate-700 border-slate-300',
  // Route status
  planned:        'bg-violet-100 text-violet-700 border-violet-200',
  in_progress:    'bg-blue-100 text-blue-700 border-blue-200',
  completed:      'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled:      'bg-slate-100 text-slate-500 border-slate-200',
  with_alert:     'bg-red-100 text-red-700 border-red-200',
}

const labels: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
  critical: 'Crítico',
  warning: 'Atenção',
  info: 'Info',
  low: 'Baixo',
  online: '● Online',
  offline: '○ Offline',
  maintenance: '🔧 Manutenção',
  in_operation: '▶ Em Operação',
  no_comm: '⚡ Sem Comunicação',
  blocked: '🚫 Bloqueado',
  planned: 'Planejada',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
  with_alert: 'Com Alerta',
}

interface StatusBadgeProps {
  value: string
  customLabel?: string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ value, customLabel, size = 'sm' }: StatusBadgeProps) {
  const key = value?.toLowerCase().replace(/\s+/g, '_')
  const style = variants[key] || 'bg-slate-100 text-slate-600 border-slate-200'
  const label = customLabel || labels[key] || value

  return (
    <span className={`inline-flex items-center border rounded-full font-semibold ${size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'} ${style}`}>
      {label}
    </span>
  )
}
