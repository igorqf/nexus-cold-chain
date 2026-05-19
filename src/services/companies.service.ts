import { createClient } from '@/lib/supabase/client'

export const CompaniesService = {
  async list() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(payload: any) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('companies')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: any) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('companies')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async softDelete(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('companies')
      .update({ 
        status: 'inactive', 
        deleted_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
