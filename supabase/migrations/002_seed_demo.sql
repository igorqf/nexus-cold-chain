-- =====================================================
-- NEXUS COLD CHAIN — SEED DE DEMONSTRAÇÃO
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- COMPANIES
INSERT INTO companies (id, name, cnpj, status) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Nexus Logística Vital', '12.345.678/0001-90', 'active'),
  ('11111111-0000-0000-0000-000000000002', 'Aguia Branca Transportes', '98.765.432/0001-10', 'active'),
  ('11111111-0000-0000-0000-000000000003', 'FarmaCool Distribuidora', '55.123.456/0001-77', 'active');

-- OPERATIONAL BASES
INSERT INTO operational_bases (id, company_id, name, address, status) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'CD São Paulo - Guarulhos', 'Av. Guarulhos, 1500 - Guarulhos/SP', 'active'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'CD Rio de Janeiro - Duque de Caxias', 'Rod. Washington Luiz, 3200 - Duque de Caxias/RJ', 'active'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 'Terminal Vitória - ES', 'Av. Jerônimo Monteiro, 900 - Vitória/ES', 'active'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', 'CD Belo Horizonte', 'Rua dos Inconfidentes, 1100 - BH/MG', 'active');

-- ROLES
INSERT INTO roles (id, name, description, status) VALUES
  ('33333333-0000-0000-0000-000000000001', 'admin_global', 'Administrador global da plataforma', 'active'),
  ('33333333-0000-0000-0000-000000000002', 'gestor_operacao', 'Gestor de operações logísticas', 'active'),
  ('33333333-0000-0000-0000-000000000003', 'operador_base', 'Operador de base/CD', 'active'),
  ('33333333-0000-0000-0000-000000000004', 'analista_qualidade', 'Analista de qualidade e conformidade', 'active');

-- ASSETS (Veículos e câmaras)
INSERT INTO assets (id, company_id, base_id, name, type, plate, status) VALUES
  ('44444444-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Truck Refrigerado SP-01', 'vehicle', 'ABC-1234', 'active'),
  ('44444444-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Truck Refrigerado SP-02', 'vehicle', 'DEF-5678', 'active'),
  ('44444444-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Van Farmacêutica RJ-01', 'vehicle', 'GHI-9012', 'active'),
  ('44444444-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', 'Câmara Fria CD-GRU-01', 'cold_room', NULL, 'active'),
  ('44444444-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', 'Câmara Fria CD-RJ-01', 'cold_room', NULL, 'active'),
  ('44444444-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', 'Truck Refrigerado VIX-01', 'vehicle', 'JKL-3456', 'active'),
  ('44444444-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004', 'Freezer Farmacêutico BH-01', 'freezer', NULL, 'active');

-- SENSOR DEVICES
INSERT INTO sensor_devices (id, company_id, asset_id, name, mac_address, type, status) VALUES
  ('55555555-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 'Sensor Temp SP-01-A', 'AA:BB:CC:DD:EE:01', 'temperature', 'active'),
  ('55555555-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 'Sensor Umid SP-01-B', 'AA:BB:CC:DD:EE:02', 'humidity', 'active'),
  ('55555555-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000002', 'Sensor Temp SP-02-A', 'AA:BB:CC:DD:EE:03', 'temperature', 'active'),
  ('55555555-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000003', 'Sensor Temp RJ-01-A', 'AA:BB:CC:DD:EE:04', 'temperature', 'active'),
  ('55555555-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000004', 'Sensor Câmara GRU-01', 'AA:BB:CC:DD:EE:05', 'temperature', 'active'),
  ('55555555-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000005', 'Sensor Câmara RJ-01', 'AA:BB:CC:DD:EE:06', 'temperature', 'active'),
  ('55555555-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000006', 'Sensor Temp VIX-01-A', 'AA:BB:CC:DD:EE:07', 'temperature', 'active'),
  ('55555555-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000007', 'Sensor Freezer BH-01', 'AA:BB:CC:DD:EE:08', 'temperature', 'active');

-- PRODUCTS
INSERT INTO products (id, company_id, name, category, temp_min, temp_max, status) VALUES
  ('66666666-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Insulina Humana', 'Farmacêutico', 2, 8, 'active'),
  ('66666666-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Vacina COVID-19', 'Imunobiológico', -20, -15, 'active'),
  ('66666666-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Frango Resfriado', 'Alimento', 0, 4, 'active'),
  ('66666666-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Sorvete Premium', 'Alimento', -25, -18, 'active'),
  ('66666666-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Hemoderivados', 'Hemoterápico', 2, 6, 'active'),
  ('66666666-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000003', 'Antibióticos Injetáveis', 'Farmacêutico', 15, 25, 'active');

-- ALERT RULES
INSERT INTO alert_rules (id, company_id, name, condition, threshold, severity, status) VALUES
  ('77777777-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Temperatura Alta Crítica', 'temp > threshold', 10, 'critical', 'active'),
  ('77777777-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Temperatura Baixa Crítica', 'temp < threshold', -5, 'critical', 'active'),
  ('77777777-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Temperatura Alta Atenção', 'temp > threshold', 8, 'warning', 'active'),
  ('77777777-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000002', 'Sensor Offline', 'sensor_offline', 30, 'warning', 'active');

-- ALERT EVENTS (mistura de ativos e resolvidos)
INSERT INTO alert_events (id, company_id, rule_id, sensor_id, message, severity, resolved_at, status) VALUES
  ('88888888-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000001', 'Temperatura atingiu 11.3°C no Truck SP-01 — acima do limite permitido de 10°C', 'critical', NULL, 'active'),
  ('88888888-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000003', '55555555-0000-0000-0000-000000000003', 'Temperatura em 8.7°C no Truck SP-02 — atenção, próximo ao limite', 'warning', NULL, 'active'),
  ('88888888-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000004', '55555555-0000-0000-0000-000000000007', 'Sensor VIX-01-A sem comunicação há 45 minutos', 'warning', NULL, 'active'),
  ('88888888-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000001', '55555555-0000-0000-0000-000000000004', 'Temperatura atingiu 12.1°C na Van RJ-01 — excedeu limite crítico', 'critical', now() - interval '2 hours', 'active'),
  ('88888888-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', '77777777-0000-0000-0000-000000000002', '55555555-0000-0000-0000-000000000005', 'Temperatura na Câmara GRU-01 caiu para -6°C — abaixo do limite mínimo', 'critical', now() - interval '5 hours', 'active');

-- OCCURRENCES
INSERT INTO occurrences (company_id, alert_id, description, action_taken, status) VALUES
  ('11111111-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000004', 'Desvio de temperatura detectado na Van RJ-01 durante trajeto RJ-SP', 'Carga transferida para veículo reserva. Lote bloqueado para análise de qualidade.', 'inactive'),
  ('11111111-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000005', 'Falha no sistema de refrigeração da Câmara Fria GRU-01', 'Técnico acionado. Manutenção corretiva realizada. Compressor substituído.', 'inactive'),
  ('11111111-0000-0000-0000-000000000001', '88888888-0000-0000-0000-000000000001', 'Temperatura elevada no Truck SP-01 — possível falha no evaporador', 'OS de manutenção aberta. Análise em andamento.', 'active');

-- ROUTE OPERATIONS
INSERT INTO route_operations (company_id, base_id, asset_id, name, origin, destination, status) VALUES
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000001', 'Rota GRU → Campinas', 'CD Guarulhos', 'Campinas/SP', 'active'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000002', 'Rota GRU → Santos', 'CD Guarulhos', 'Porto de Santos/SP', 'active'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000003', 'Rota RJ → Niterói', 'CD Duque de Caxias', 'Niterói/RJ', 'active'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000006', 'Rota VIX → Cachoeiro', 'Terminal Vitória', 'Cachoeiro de Itapemirim/ES', 'completed');

-- COLD CHAIN PARAMETERS
INSERT INTO cold_chain_parameters (company_id, name, config_json, status) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Parâmetros Farmacêuticos', '{"temp_min": 2, "temp_max": 8, "humidity_max": 60, "alert_delay_minutes": 5}', 'active'),
  ('11111111-0000-0000-0000-000000000001', 'Parâmetros Congelados', '{"temp_min": -25, "temp_max": -15, "humidity_max": 80, "alert_delay_minutes": 3}', 'active'),
  ('11111111-0000-0000-0000-000000000002', 'Parâmetros Hemoterápicos', '{"temp_min": 2, "temp_max": 6, "humidity_max": 50, "alert_delay_minutes": 2}', 'active');
