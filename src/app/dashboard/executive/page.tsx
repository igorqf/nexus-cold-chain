import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ExecutivePage() {
  const supabase = await createClient()
  let alerts: any[] = [], assets: any[] = [], occurrences: any[] = [], routes: any[] = []

  try { const { data } = await supabase.from('alert_events').select('*').is('deleted_at', null); alerts = data || [] } catch {}
  try { const { data } = await supabase.from('assets').select('*').is('deleted_at', null); assets = data || [] } catch {}
  try { const { data } = await supabase.from('occurrences').select('*').is('deleted_at', null); occurrences = data || [] } catch {}
  try { const { data } = await supabase.from('route_operations').select('*').is('deleted_at', null); routes = data || [] } catch {}

  const totalAlerts = alerts.length
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length
  const resolvedAlerts = alerts.filter(a => a.resolved_at).length
  const resolutionRate = totalAlerts > 0 ? Math.round((resolvedAlerts / totalAlerts) * 100) : 0
  const activeRoutes = routes.filter(r => r.status === 'active').length
  const resolvedOS = occurrences.filter(o => o.status === 'inactive').length

  const kpis = [
    { label: 'Total de Ativos', value: assets.length, sub: 'veículos e câmaras', color: 'border-blue-500 bg-blue-50' },
    { label: 'Alertas Ativos', value: alerts.filter(a => !a.resolved_at).length, sub: `${criticalAlerts} críticos`, color: 'border-red-500 bg-red-50' },
    { label: 'Taxa de Resolução', value: `${resolutionRate}%`, sub: `${resolvedAlerts} de ${totalAlerts} alertas`, color: 'border-emerald-500 bg-emerald-50' },
    { label: 'Rotas em Trânsito', value: activeRoutes, sub: `${routes.length} total`, color: 'border-teal-500 bg-teal-50' },
    { label: 'OS Resolvidas', value: resolvedOS, sub: `${occurrences.length} total`, color: 'border-violet-500 bg-violet-50' },
  ]

  const monthlyData = [
    { month: 'Jan', alerts: 12, resolved: 11 },
    { month: 'Fev', alerts: 8, resolved: 8 },
    { month: 'Mar', alerts: 15, resolved: 13 },
    { month: 'Abr', alerts: 6, resolved: 6 },
    { month: 'Mai', alerts: totalAlerts, resolved: resolvedAlerts },
  ]

  const maxAlerts = Math.max(...monthlyData.map(d => d.alerts), 1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Visão Executiva</h2>
        <p className="text-sm text-slate-500 mt-1">Indicadores estratégicos de performance da cadeia de frio.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className={`bg-white rounded-xl border-l-4 p-5 shadow-sm ${kpi.color}`}>
            <div className="text-3xl font-black text-slate-800">{kpi.value}</div>
            <div className="font-semibold text-slate-700 text-sm mt-1">{kpi.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-6">Alertas por Mês</h3>
        <div className="flex items-end gap-4 h-40">
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center gap-1 justify-end" style={{ height: '120px' }}>
                <div
                  className="w-full bg-red-400 rounded-t-md relative group cursor-default transition-all hover:bg-red-500"
                  style={{ height: `${(d.alerts / maxAlerts) * 100}px`, minHeight: '4px' }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">{d.alerts}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block"></span>Total de Alertas</span>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Resumo por Empresa</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Empresa</th>
              <th className="px-6 py-3">Alertas</th>
              <th className="px-6 py-3">Críticos</th>
              <th className="px-6 py-3">Resolvidos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-medium">Nexus Logística Vital</td><td className="px-6 py-3">{alerts.filter(a => a.company_id === '11111111-0000-0000-0000-000000000001').length}</td><td className="px-6 py-3 text-red-600 font-semibold">{alerts.filter(a => a.company_id === '11111111-0000-0000-0000-000000000001' && a.severity === 'critical').length}</td><td className="px-6 py-3 text-emerald-600">{alerts.filter(a => a.company_id === '11111111-0000-0000-0000-000000000001' && a.resolved_at).length}</td></tr>
            <tr className="hover:bg-slate-50"><td className="px-6 py-3 font-medium">Aguia Branca Transportes</td><td className="px-6 py-3">{alerts.filter(a => a.company_id === '11111111-0000-0000-0000-000000000002').length}</td><td className="px-6 py-3 text-red-600 font-semibold">{alerts.filter(a => a.company_id === '11111111-0000-0000-0000-000000000002' && a.severity === 'critical').length}</td><td className="px-6 py-3 text-emerald-600">{alerts.filter(a => a.company_id === '11111111-0000-0000-0000-000000000002' && a.resolved_at).length}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
