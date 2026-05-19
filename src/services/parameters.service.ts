import { createClient } from '@/lib/supabase/server'

export const ParametersService = {
  async list() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cold_chain_parameters')
      .select('*, companies(name)')
      .eq('status', 'active')
      .is('deleted_at', null)
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cold_chain_parameters')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cold_chain_parameters')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('cold_chain_parameters')
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
      .from('cold_chain_parameters')
      .update({ status: 'inactive', deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
