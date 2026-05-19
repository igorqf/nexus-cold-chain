import { createClient } from '@/lib/supabase/server'

export const SensorsService = {
  async list() {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sensor_devices')
      .select('*, companies(name), assets(name)')
      .eq('status', 'active')
      .is('deleted_at', null)
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sensor_devices')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sensor_devices')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: any) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sensor_devices')
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
      .from('sensor_devices')
      .update({ status: 'inactive', deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}
