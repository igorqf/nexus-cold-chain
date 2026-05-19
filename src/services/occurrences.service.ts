import { createClient } from '@/lib/supabase/server'

export const OccurrencesService = {
  async list() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('occurrences')
      .select('*, alert_events(message), companies(name)')
      .eq('status', 'active')
      .is('deleted_at', null)
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('occurrences')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('occurrences')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('occurrences')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async softDelete(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('occurrences')
      .update({ status: 'inactive', deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
