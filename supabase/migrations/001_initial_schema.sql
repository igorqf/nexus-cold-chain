-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. companies
CREATE TABLE companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cnpj text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 2. operational_bases
CREATE TABLE operational_bases (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  name text not null,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 3. roles
CREATE TABLE roles (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- e.g., 'admin_global', 'admin_empresa', 'gestor_operacao', 'operador_base', 'visualizador'
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 4. permissions
CREATE TABLE permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid references roles(id) not null,
  module text not null,
  action text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 5. users_profiles
CREATE TABLE users_profiles (
  id uuid primary key references auth.users(id), -- linked to Supabase Auth
  company_id uuid references companies(id),
  base_id uuid references operational_bases(id),
  role_id uuid references roles(id),
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 6. assets
CREATE TABLE assets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  base_id uuid references operational_bases(id),
  name text not null,
  type text not null,
  plate text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 7. sensor_devices
CREATE TABLE sensor_devices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  asset_id uuid references assets(id),
  name text not null,
  mac_address text unique,
  type text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 8. products
CREATE TABLE products (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  name text not null,
  category text,
  temp_min numeric,
  temp_max numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 9. route_operations
CREATE TABLE route_operations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  base_id uuid references operational_bases(id),
  asset_id uuid references assets(id),
  name text not null,
  origin text,
  destination text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 10. cold_chain_parameters
CREATE TABLE cold_chain_parameters (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  name text not null,
  config_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 11. alert_rules
CREATE TABLE alert_rules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  name text not null,
  condition text,
  threshold numeric,
  severity text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 12. alert_events
CREATE TABLE alert_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  rule_id uuid references alert_rules(id),
  sensor_id uuid references sensor_devices(id),
  message text not null,
  severity text,
  resolved_at timestamptz nullable,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 13. occurrences
CREATE TABLE occurrences (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  alert_id uuid references alert_events(id),
  description text not null,
  action_taken text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 14. integrations
CREATE TABLE integrations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  system_name text not null,
  api_key text,
  endpoint text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 15. audit_logs
CREATE TABLE audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id),
  user_id uuid references users_profiles(id),
  module text not null,
  action text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- 16. system_settings
CREATE TABLE system_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) not null,
  setting_key text not null,
  setting_value text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz nullable,
  status text default 'active'
);

-- RLS (Row Level Security) ENABLE
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_chain_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Note: In a real environment, you'd create complex policies here checking auth.uid() against users_profiles.company_id and users_profiles.role_id.
-- For now, a simplified policy structure that you can expand:

CREATE OR REPLACE FUNCTION get_user_company_id() RETURNS uuid AS $$
  SELECT company_id FROM public.users_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_global() RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.users_profiles up
    JOIN public.roles r ON up.role_id = r.id
    WHERE up.id = auth.uid() AND r.name = 'admin_global'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Example Policy for Assets
CREATE POLICY assets_isolation_policy ON assets
  FOR ALL
  USING (
    is_admin_global() 
    OR company_id = get_user_company_id()
  );
  
-- Apply similar policies to all other operational tables
-- (You would script the rest in the actual database or use the dashboard)
