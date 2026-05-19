import { createClient } from '@/lib/supabase/server'

export const AuditService = {
  async list() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, users_profiles(full_name), companies(name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  // Audit logs are usually append-only, but keeping signature for pattern
  async create(payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  }
}
