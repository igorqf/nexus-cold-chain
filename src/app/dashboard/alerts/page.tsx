import { AlertsService } from '@/services/alerts.service'

export const dynamic = 'force-dynamic'

export default async function AlertsPage() {
  let alerts = []
  try {
    alerts = await AlertsService.list()
  } catch (error) {
    console.error('Error fetching alerts:', error)
  }

  const severityStyles: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Alertas e Anomalias</h2>
          <p className="text-sm text-slate-500 mt-1">Eventos de temperatura fora dos limites e falhas detectadas pelos sensores.</p>
        </div>
        <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
          {alerts.filter((a: any) => !a.resolved_at).length} ativos
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Severidade</th>
              <th className="px-6 py-4">Mensagem</th>
              <th className="px-6 py-4">Sensor</th>
              <th className="px-6 py-4">Criado em</th>
              <th className="px-6 py-4">Resolvido em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {alerts.map((alert: any) => (
              <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${severityStyles[alert.severity] || severityStyles.info}`}>
                    {alert.severity || 'info'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800 max-w-xs truncate">{alert.message}</td>
                <td className="px-6 py-4 text-slate-500">{alert.sensor_devices?.name || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{new Date(alert.created_at).toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4">
                  {alert.resolved_at
                    ? <span className="text-emerald-600 font-medium">{new Date(alert.resolved_at).toLocaleString('pt-BR')}</span>
                    : <span className="text-red-500 font-medium">Pendente</span>
                  }
                </td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Nenhum alerta registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
