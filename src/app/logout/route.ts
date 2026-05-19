import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Error signing out from Supabase:', error)
  }

  // Robustly clear all cookies starting with 'sb-' (Supabase)
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-')) {
      cookieStore.set(cookie.name, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
      })
    }
  }

  const url = new URL(request.url)
  const redirectUrl = new URL('/login', url.origin)
  return NextResponse.redirect(redirectUrl)
}

export const dynamic = 'force-dynamic'
