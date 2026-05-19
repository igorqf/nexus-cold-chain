import { createClient } from '@/lib/supabase/server'

export const UsersService = {
  async list() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users_profiles')
      .select('*, companies(name), operational_bases(name), roles(name)')
      .eq('status', 'active')
      .is('deleted_at', null)
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users_profiles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users_profiles')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users_profiles')
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
      .from('users_profiles')
      .update({ status: 'inactive', deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
