import { createClient } from '@/lib/supabase/server'
import { AlertsService } from '@/services/alerts.service'
import { AssetsService } from '@/services/assets.service'
import { SensorsService } from '@/services/sensors.service'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let alerts: any[] = []
  let assets: any[] = []
  let sensors: any[] = []

  try { alerts = await AlertsService.list() } catch {}
  try { assets = await AssetsService.list() } catch {}
  try { sensors = await SensorsService.list() } catch {}

  const activeAlerts = alerts.filter(a => !a.resolved_at)
  const activeSensors = sensors.filter(s => s.status === 'active')

  const kpis = [
    { label: 'Ativos Monitorados', value: assets.length, color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🚛' },
    { label: 'Sensores Ativos', value: activeSensors.length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '📡' },
    { label: 'Alertas Ativos', value: activeAlerts.length, color: activeAlerts.length > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🔔' },
    { label: 'Alertas Críticos', value: activeAlerts.filter(a => a.severity === 'critical').length, color: 'bg-red-50 text-red-700 border-red-200', icon: '⚠️' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-1">Torre de Controle</h1>
        <p className="text-slate-300 text-sm">
          Bem-vindo, <span className="font-semibold text-teal-400">{user?.email}</span>
          {' '}— visão geral da cadeia de frio em tempo real.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border p-6 ${kpi.color}`}>
            <div className="text-3xl mb-2">{kpi.icon}</div>
            <div className="text-3xl font-extrabold">{kpi.value}</div>
            <div className="text-sm font-medium mt-1 opacity-80">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Alertas Recentes</h2>
          <p className="text-sm text-slate-500 mt-1">Últimas anomalias detectadas pelos sensores IoT.</p>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Severidade</th>
              <th className="px-6 py-3">Mensagem</th>
              <th className="px-6 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {activeAlerts.slice(0, 5).map((alert) => (
              <tr key={alert.id} className="hover:bg-slate-50">
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-700 max-w-xs truncate">{alert.message}</td>
                <td className="px-6 py-3 text-slate-500">{new Date(alert.created_at).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
            {activeAlerts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-slate-400">
                  ✅ Nenhum alerta ativo no momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
