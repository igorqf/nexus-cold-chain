import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function MaintenancePage() {
  const supabase = await createClient()
  let occurrences: any[] = []
  let assets: any[] = []

  try {
    const { data } = await supabase
      .from('occurrences')
      .select('*, alert_events(message, severity, sensor_id, sensor_devices(name, assets(name, plate)))')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    occurrences = data || []
  } catch {}

  try {
    const { data } = await supabase.from('assets').select('*, operational_bases(name)').is('deleted_at', null)
    assets = data || []
  } catch {}

  const statusMap: Record<string, { label: string; style: string }> = {
    active: { label: 'Aberto', style: 'bg-amber-100 text-amber-700 border-amber-200' },
    inactive: { label: 'Resolvido', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-3xl font-black text-amber-500">{occurrences.filter(o => o.status === 'active').length}</div>
          <div className="text-sm text-slate-500 mt-1 font-medium">OS Abertas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-3xl font-black text-emerald-500">{occurrences.filter(o => o.status === 'inactive').length}</div>
          <div className="text-sm text-slate-500 mt-1 font-medium">OS Resolvidas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-3xl font-black text-blue-500">{assets.length}</div>
          <div className="text-sm text-slate-500 mt-1 font-medium">Ativos Monitorados</div>
        </div>
      </div>

      {/* Occurrences Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ordens de Manutenção</h2>
            <p className="text-sm text-slate-500 mt-1">Ocorrências e manutenções corretivas/preditivas registradas.</p>
          </div>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
            + Nova OS
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Descrição</th>
              <th className="px-6 py-4">Ação Tomada</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {occurrences.map((occ: any) => {
              const s = statusMap[occ.status] || statusMap.active
              return (
                <tr key={occ.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800 max-w-xs">{occ.description}</td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs">{occ.action_taken || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${s.style}`}>{s.label}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{new Date(occ.created_at).toLocaleString('pt-BR')}</td>
                </tr>
              )
            })}
            {occurrences.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">Nenhuma OS registrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
