'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Snowflake, LayoutDashboard, Building2, MapPin, Users, ShieldCheck,
  Truck, Cpu, Package, Route, BellRing, Wrench, AlertTriangle,
  SlidersHorizontal, Plug, ClipboardList, Settings, LogOut,
  ChevronDown, BarChart3, FileText, Activity, Menu, X
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface NavGroup {
  label: string
  icon: React.ElementType
  color: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Operação',
    icon: Activity,
    color: 'text-teal-400',
    items: [
      { href: '/dashboard', label: 'Torre de Controle', icon: LayoutDashboard },
      { href: '/dashboard/alerts', label: 'Alertas e Anomalias', icon: BellRing },
      { href: '/dashboard/maintenance', label: 'Manutenção Proativa', icon: Wrench },
      { href: '/dashboard/traceability', label: 'Rastreabilidade', icon: Route },
      { href: '/dashboard/executive', label: 'Visão Executiva', icon: BarChart3 },
    ]
  },
  {
    label: 'Cadastros',
    icon: ClipboardList,
    color: 'text-blue-400',
    items: [
      { href: '/dashboard/companies', label: 'Empresas', icon: Building2 },
      { href: '/dashboard/bases', label: 'Bases Operacionais', icon: MapPin },
      { href: '/dashboard/users', label: 'Usuários', icon: Users },
      { href: '/dashboard/roles', label: 'Perfis e Permissões', icon: ShieldCheck },
      { href: '/dashboard/assets', label: 'Ativos', icon: Truck },
      { href: '/dashboard/sensors', label: 'Sensores / IoT', icon: Cpu },
      { href: '/dashboard/products', label: 'Produtos', icon: Package },
      { href: '/dashboard/routes', label: 'Rotas', icon: Route },
    ]
  },
  {
    label: 'Controle',
    icon: SlidersHorizontal,
    color: 'text-violet-400',
    items: [
      { href: '/dashboard/occurrences', label: 'Ocorrências', icon: AlertTriangle },
      { href: '/dashboard/parameters', label: 'Parâmetros Cold Chain', icon: SlidersHorizontal },
      { href: '/dashboard/rules', label: 'Regras de Alerta', icon: BellRing },
    ]
  },
  {
    label: 'Administração',
    icon: Settings,
    color: 'text-slate-400',
    items: [
      { href: '/dashboard/integrations', label: 'Integrações', icon: Plug },
      { href: '/dashboard/audit', label: 'Auditoria e Logs', icon: ClipboardList },
      { href: '/dashboard/reports', label: 'Relatórios', icon: FileText },
      { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
    ]
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const isGroupActive = (group: NavGroup) => group.items.some(i => isActive(i.href))

  const toggleGroup = (label: string) =>
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }))

  const isGroupOpen = (group: NavGroup) => {
    if (collapsed[group.label] !== undefined) return !collapsed[group.label]
    return isGroupActive(group)
  }

  const pageTitle = navGroups.flatMap(g => g.items).find(i => isActive(i.href))?.label || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-[240px] bg-slate-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Snowflake size={18} className="text-white" />
          </div>
          <div>
            <div className="font-black text-[13px] tracking-wider text-white">NEXUS</div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-teal-400">Cold Chain Intel.</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin">
          {navGroups.map(group => {
            const Icon = group.icon
            const open = isGroupOpen(group)
            const active = isGroupActive(group)

            return (
              <div key={group.label} className="mb-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={13} className={active ? group.color : ''} />
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Group Items */}
                <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-2 border-l border-slate-800 pl-3 py-1 space-y-0.5">
                    {group.items.map(item => {
                      const ItemIcon = item.icon
                      const itemActive = isActive(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                            itemActive
                              ? 'bg-teal-500/20 text-teal-400 font-semibold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <ItemIcon size={15} />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>

        {/* User footer */}
        <Link
          href="/logout"
          className="mx-2 mb-3 px-3 py-3 rounded-xl border border-slate-800 flex items-center gap-3 hover:bg-slate-800 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold text-xs flex-shrink-0">
            IQ
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Igor Quadros</div>
            <div className="text-[10px] text-slate-500 truncate">Admin Global</div>
          </div>
          <LogOut size={14} className="text-slate-500 group-hover:text-red-400 transition-colors flex-shrink-0" />
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-slate-500">
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-slate-800 text-sm truncate">{pageTitle}</h1>
          </div>
          <Link
            href="/dashboard/alerts"
            className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <BellRing size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">3</span>
          </Link>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
