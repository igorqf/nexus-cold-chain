import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Static/public paths — always allow
  const isAuthRoute = pathname.startsWith('/login')
  const isApiRoute = pathname.startsWith('/api')

  // Check for Supabase session cookie (sb-*-auth-token)
  const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

  if (!hasSession && !isAuthRoute && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (hasSession && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
