export const dynamic = 'force-dynamic'

const reportTypes = [
  {
    icon: '🌡️',
    title: 'Relatório de Temperatura',
    description: 'Histórico de leituras de temperatura por ativo, com gráficos de desvio e conformidade ANVISA.',
    tag: 'Conformidade',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    icon: '🔔',
    title: 'Relatório de Alertas',
    description: 'Consolidado de eventos de alerta por período, veículo e severidade. Inclui MTTR e taxa de resolução.',
    tag: 'Operacional',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: '🚛',
    title: 'Relatório de Rotas',
    description: 'Desempenho das rotas de transporte com indicadores de temperatura e rastreabilidade ponta a ponta.',
    tag: 'Logística',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  {
    icon: '🔧',
    title: 'Relatório de Manutenção',
    description: 'Ordens de serviço abertas e resolvidas, tempo médio de reparo e histórico por ativo.',
    tag: 'Manutenção',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    icon: '📋',
    title: 'Relatório ANVISA/GxP',
    description: 'Geração de evidências regulatórias para auditorias, com assinatura eletrônica e rastreabilidade.',
    tag: 'Regulatório',
    tagColor: 'bg-red-100 text-red-700',
  },
  {
    icon: '📊',
    title: 'Dashboard Executivo',
    description: 'KPIs consolidados por empresa, período e ativo. Exportável em PDF para reuniões de gestão.',
    tag: 'Executivo',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Central de Relatórios</h2>
          <p className="text-sm text-slate-500 mt-1">Geração de relatórios regulatórios, operacionais e executivos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportTypes.map((r) => (
          <div key={r.title} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="text-4xl mb-4">{r.icon}</div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">{r.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${r.tagColor}`}>{r.tag}</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{r.description}</p>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors">
                Gerar PDF
              </button>
              <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg transition-colors">
                Exportar CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Relatórios Gerados Recentemente</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Relatório</th>
              <th className="px-6 py-3">Solicitante</th>
              <th className="px-6 py-3">Período</th>
              <th className="px-6 py-3">Data Geração</th>
              <th className="px-6 py-3">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Relatório ANVISA - Abril/2026', user: 'Igor Quadros', period: 'Abr/2026', date: '02/05/2026 09:14' },
              { name: 'Relatório de Alertas - Q1 2026', user: 'Igor Quadros', period: 'Jan-Mar/2026', date: '01/04/2026 14:32' },
              { name: 'Dashboard Executivo - Mar/2026', user: 'Igor Quadros', period: 'Mar/2026', date: '31/03/2026 17:00' },
            ].map((r) => (
              <tr key={r.name} className="hover:bg-slate-50">
                <td className="px-6 py-3 font-medium text-slate-800">{r.name}</td>
                <td className="px-6 py-3 text-slate-500">{r.user}</td>
                <td className="px-6 py-3 text-slate-500">{r.period}</td>
                <td className="px-6 py-3 text-slate-400">{r.date}</td>
                <td className="px-6 py-3">
                  <button className="text-teal-600 hover:text-teal-800 text-xs font-semibold">⬇ Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
