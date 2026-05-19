// =============================================
// NEXUS COLD CHAIN — TYPE DEFINITIONS
// =============================================

export type Status = 'active' | 'inactive' | 'pending'
export type Severity = 'critical' | 'warning' | 'info' | 'low'
export type Criticality = 'low' | 'medium' | 'high' | 'critical'

export interface Company {
  id: string
  name: string
  trade_name?: string
  cnpj?: string
  state_registration?: string
  segment?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  status: Status
  notes?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface OperationalBase {
  id: string
  company_id: string
  company?: Company
  name: string
  type?: string
  responsible?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  latitude?: number
  longitude?: number
  capacity?: number
  capacity_unit?: string
  working_hours?: string
  status: Status
  notes?: string
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  description?: string
  status: Status
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  company_id?: string
  company?: Company
  base_id?: string
  base?: OperationalBase
  role_id?: string
  role?: Role
  full_name?: string
  email?: string
  phone?: string
  cpf?: string
  status: Status
  allow_web?: boolean
  allow_mobile?: boolean
  last_access?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  company_id: string
  company?: Company
  base_id?: string
  base?: OperationalBase
  internal_code?: string
  name: string
  type: string
  plate?: string
  model?: string
  manufacturer?: string
  year?: number
  capacity?: number
  capacity_unit?: string
  temp_min?: number
  temp_max?: number
  is_mobile?: boolean
  status: Status
  notes?: string
  created_at: string
  updated_at: string
}

export interface SensorDevice {
  id: string
  company_id: string
  company?: Company
  asset_id?: string
  asset?: Asset
  name: string
  external_id?: string
  imei?: string
  serial?: string
  manufacturer?: string
  model?: string
  type: string
  protocol?: string
  carrier?: string
  iccid?: string
  transmission_interval?: number
  endpoint?: string
  firmware?: string
  install_date?: string
  last_maintenance?: string
  battery?: number
  last_communication?: string
  status: Status
  notes?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  company_id: string
  company?: Company
  name: string
  internal_code?: string
  category?: string
  description?: string
  temp_min?: number
  temp_max?: number
  humidity_min?: number
  humidity_max?: number
  max_time_out_of_range?: number
  criticality?: Criticality
  requires_full_traceability?: boolean
  requires_delivery_evidence?: boolean
  status: Status
  created_at: string
  updated_at: string
}

export interface RouteOperation {
  id: string
  company_id: string
  company?: Company
  base_id?: string
  base?: OperationalBase
  destination_base_id?: string
  asset_id?: string
  asset?: Asset
  product_id?: string
  product?: Product
  name: string
  internal_code?: string
  origin?: string
  destination?: string
  driver?: string
  planned_start?: string
  planned_end?: string
  expected_temp?: number
  parameter_id?: string
  status: Status
  notes?: string
  created_at: string
  updated_at: string
}

export interface ColdChainParameter {
  id: string
  company_id: string
  company?: Company
  name: string
  product_id?: string
  product?: Product
  category?: string
  temp_min?: number
  temp_max?: number
  humidity_min?: number
  humidity_max?: number
  max_time_out_of_range?: number
  max_time_no_comm?: number
  min_battery?: number
  criticality?: Criticality
  recommended_action?: string
  config_json?: Record<string, any>
  status: Status
  created_at: string
  updated_at: string
}

export interface AlertRule {
  id: string
  company_id: string
  company?: Company
  name: string
  type?: string
  condition?: string
  threshold?: number
  tolerance_time?: number
  severity: Severity
  notification_channels?: string[]
  notified_users?: string[]
  base_id?: string
  product_id?: string
  asset_id?: string
  status: Status
  created_at: string
  updated_at: string
}

export interface AlertEvent {
  id: string
  company_id: string
  rule_id?: string
  rule?: AlertRule
  sensor_id?: string
  sensor?: SensorDevice
  message: string
  severity: Severity
  resolved_at?: string
  status: Status
  created_at: string
  updated_at: string
}

export interface Occurrence {
  id: string
  company_id: string
  company?: Company
  alert_id?: string
  alert?: AlertEvent
  base_id?: string
  asset_id?: string
  asset?: Asset
  sensor_id?: string
  product_id?: string
  route_id?: string
  type?: string
  description: string
  criticality?: Criticality
  responsible?: string
  action_taken?: string
  status: Status
  created_at: string
  updated_at: string
}

export interface Integration {
  id: string
  company_id?: string
  name: string
  type?: string
  external_system?: string
  url?: string
  method?: string
  token?: string
  headers?: Record<string, string>
  sync_frequency?: string
  last_sync?: string
  status: Status
  notes?: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  company_id?: string
  user_id?: string
  user?: UserProfile
  module: string
  action: string
  entity_id?: string
  old_data?: Record<string, any>
  new_data?: Record<string, any>
  ip?: string
  status: Status
  created_at: string
  updated_at: string
}
