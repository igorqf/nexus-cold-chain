import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function TraceabilityPage() {
  const supabase = await createClient()
  let routes: any[] = []

  try {
    const { data } = await supabase
      .from('route_operations')
      .select('*, companies(name), operational_bases(name), assets(name, plate)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    routes = data || []
  } catch {}

  const statusMap: Record<string, { label: string; style: string; dot: string }> = {
    active:    { label: 'Em Trânsito', style: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    completed: { label: 'Concluída', style: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    inactive:  { label: 'Cancelada', style: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Rastreabilidade de Rotas</h2>
        <p className="text-sm text-slate-500 mt-1">Linha do tempo das operações de transporte com rastreio ponta a ponta.</p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {routes.map((route: any, idx: number) => {
          const s = statusMap[route.status] || statusMap.inactive
          return (
            <div key={route.id} className="bg-white rounded-xl border border-slate-200 p-6 flex gap-5">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-3 h-3 rounded-full mt-1 ${s.dot}`} />
                {idx < routes.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 min-h-[40px]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900">{route.name}</div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      📍 {route.origin || '—'} → {route.destination || '—'}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${s.style}`}>{s.label}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>🚛 <strong>{route.assets?.name || '—'}</strong>{route.assets?.plate ? ` (${route.assets.plate})` : ''}</span>
                  <span>🏢 {route.companies?.name || '—'}</span>
                  <span>📦 Base: {route.operational_bases?.name || '—'}</span>
                  <span>🕒 {new Date(route.created_at).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          )
        })}
        {routes.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400">
            Nenhuma rota encontrada.
          </div>
        )}
      </div>
    </div>
  )
}
