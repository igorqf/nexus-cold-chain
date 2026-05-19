import { login } from './actions'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Next.js page component
export default async function LoginPage(props: Props) {
  const resolvedSearchParams = await props.searchParams
  const message = typeof resolvedSearchParams?.message === 'string' ? resolvedSearchParams.message : ''

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Brand Side - hidden on mobile */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-teal-500 mb-8"><path d="m10 20-2.5-2.5L5 20"/><path d="M12 22v-8"/><path d="m14 20 2.5-2.5L19 20"/><path d="m20 10-2.5 2.5L20 15"/><path d="M22 12h-8"/><path d="m20 14-2.5-2.5L20 9"/><path d="m14 4 2.5 2.5L19 4"/><path d="M12 2v8"/><path d="m10 4-2.5 2.5L5 4"/><path d="m4 14 2.5-2.5L4 9"/><path d="M2 12h8"/><path d="m4 10 2.5 2.5L4 15"/></svg>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Nexus Cold Chain<br />Intelligence
          </h1>
          <p className="text-slate-300 text-lg max-w-md">
            Plataforma de gestão e monitoramento avançado de cadeia fria.
          </p>
        </div>
        
        {/* Decorative circle */}
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-10 rounded-2xl w-full max-w-md shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-teal-600 mx-auto mb-4 md:hidden"><path d="m10 20-2.5-2.5L5 20"/><path d="M12 22v-8"/><path d="m14 20 2.5-2.5L19 20"/><path d="m20 10-2.5 2.5L20 15"/><path d="M22 12h-8"/><path d="m20 14-2.5-2.5L20 9"/><path d="m14 4 2.5 2.5L19 4"/><path d="M12 2v8"/><path d="m10 4-2.5 2.5L5 4"/><path d="m4 14 2.5-2.5L4 9"/><path d="M2 12h8"/><path d="m4 10 2.5 2.5L4 15"/></svg>
            <h2 className="text-2xl font-bold text-slate-900">Bem-vindo</h2>
            <p className="text-slate-500 mt-2">Faça login para acessar o painel</p>
          </div>

          <form action={login} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                placeholder="admin@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
