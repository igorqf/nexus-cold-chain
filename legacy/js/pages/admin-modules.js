// admin-modules.js

window.Pages = window.Pages || {};

// 1. Gestão de Usuários
Pages.AdminUsers = CrudBuilder.build({
    id: 'admin-users',
    title: 'Gestão de Usuários',
    group: 'Cadastros',
    data: window.adminData.users,
    columns: [
        { key: 'name', label: 'Nome' },
        { key: 'email', label: 'E-mail' },
        { key: 'company', label: 'Empresa' },
        { key: 'base', label: 'Base' },
        { key: 'role', label: 'Perfil' },
        { key: 'status', label: 'Status' },
        { key: 'lastAccess', label: 'Último Acesso' }
    ],
    fields: [
        { key: 'name', label: 'Nome Completo', type: 'text' },
        { key: 'email', label: 'E-mail', type: 'email' },
        { key: 'phone', label: 'Telefone', type: 'text' },
        { key: 'company', label: 'Empresa Vinculada', type: 'select', options: ['Nexus Logística', 'Hospital São Lucas'] },
        { key: 'base', label: 'Base Operacional', type: 'select', options: ['CD Matriz', 'Unidade Central'] },
        { key: 'role', label: 'Perfil de Acesso', type: 'select', options: ['Administrador Global', 'Gestor de Operação', 'Visualizador'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo', 'Pendente'] }
    ]
});

// 2. Perfis e Permissões
Pages.AdminRoles = CrudBuilder.build({
    id: 'admin-roles',
    title: 'Perfis e Permissões',
    group: 'Cadastros',
    data: window.adminData.roles,
    columns: [
        { key: 'name', label: 'Nome do Perfil' },
        { key: 'desc', label: 'Descrição' },
        { key: 'usersCount', label: 'Qtd Usuários' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'name', label: 'Nome do Perfil', type: 'text' },
        { key: 'desc', label: 'Descrição', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] }
        // Matriz de permissão pode ser renderizada num form custom futuramente
    ]
});

// 3. Empresas / Clientes
Pages.AdminCompanies = CrudBuilder.build({
    id: 'admin-companies',
    title: 'Gestão de Empresas',
    group: 'Cadastros',
    data: window.adminData.companies,
    columns: [
        { key: 'legalName', label: 'Razão Social' },
        { key: 'cnpj', label: 'CNPJ' },
        { key: 'segment', label: 'Segmento' },
        { key: 'basesCount', label: 'Bases' },
        { key: 'assetsCount', label: 'Ativos' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'legalName', label: 'Razão Social', type: 'text' },
        { key: 'tradeName', label: 'Nome Fantasia', type: 'text' },
        { key: 'cnpj', label: 'CNPJ', type: 'text' },
        { key: 'segment', label: 'Segmento', type: 'select', options: ['Operador logístico', 'Hospitais', 'Farmacêutico'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] }
    ]
});

// 4. Bases Operacionais
Pages.AdminBases = CrudBuilder.build({
    id: 'admin-bases',
    title: 'Bases Operacionais',
    group: 'Cadastros',
    data: window.adminData.bases,
    columns: [
        { key: 'name', label: 'Nome da Base' },
        { key: 'company', label: 'Empresa' },
        { key: 'type', label: 'Tipo' },
        { key: 'city', label: 'Cidade' },
        { key: 'assetsCount', label: 'Ativos' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'name', label: 'Nome da Base', type: 'text' },
        { key: 'company', label: 'Empresa', type: 'select', options: ['Nexus Logística', 'Hospital São Lucas'] },
        { key: 'type', label: 'Tipo', type: 'select', options: ['Centro de distribuição', 'Unidade hospitalar', 'Câmara fria'] },
        { key: 'city', label: 'Cidade/UF', type: 'text' },
        { key: 'responsible', label: 'Responsável', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] }
    ]
});

// 5. Ativos
Pages.AdminAssets = CrudBuilder.build({
    id: 'admin-assets',
    title: 'Gestão de Ativos',
    group: 'Cadastros',
    data: window.adminData.assets,
    columns: [
        { key: 'code', label: 'Código' },
        { key: 'name', label: 'Nome' },
        { key: 'type', label: 'Tipo' },
        { key: 'base', label: 'Base' },
        { key: 'sensor', label: 'Sensor' },
        { key: 'status', label: 'Status' },
        { key: 'lastRead', label: 'Última Leitura' }
    ],
    fields: [
        { key: 'code', label: 'Código Interno', type: 'text' },
        { key: 'name', label: 'Nome do Ativo', type: 'text' },
        { key: 'type', label: 'Tipo do Ativo', type: 'select', options: ['Veículo refrigerado', 'Câmara fria', 'Freezer'] },
        { key: 'company', label: 'Empresa', type: 'select', options: ['Nexus Logística', 'Hospital São Lucas'] },
        { key: 'base', label: 'Base Operacional', type: 'select', options: ['CD Matriz', 'Unidade Central'] },
        { key: 'sensor', label: 'Sensor Vinculado', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Em operação', 'Ativo', 'Inativo', 'Em manutenção'] }
    ]
});

// 6. Sensores
Pages.AdminSensors = CrudBuilder.build({
    id: 'admin-sensors',
    title: 'Sensores / Dispositivos',
    group: 'Cadastros',
    data: window.adminData.sensors,
    columns: [
        { key: 'imei', label: 'IMEI / Serial' },
        { key: 'type', label: 'Tipo' },
        { key: 'asset', label: 'Ativo Vinculado' },
        { key: 'battery', label: 'Bateria' },
        { key: 'lastComm', label: 'Última Com' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'imei', label: 'IMEI / Serial', type: 'text' },
        { key: 'type', label: 'Tipo de Sensor', type: 'select', options: ['Sensor de temperatura', 'Sensor de temperatura e umidade'] },
        { key: 'asset', label: 'Ativo Vinculado', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Online', 'Offline', 'Em manutenção'] }
    ]
});

// 7. Produtos
Pages.AdminProducts = CrudBuilder.build({
    id: 'admin-products',
    title: 'Produtos Monitorados',
    group: 'Cadastros',
    data: window.adminData.products,
    columns: [
        { key: 'name', label: 'Nome' },
        { key: 'category', label: 'Categoria' },
        { key: 'minTemp', label: 'Temp Min' },
        { key: 'maxTemp', label: 'Temp Max' },
        { key: 'sensitivity', label: 'Sensibilidade' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'name', label: 'Nome do Produto', type: 'text' },
        { key: 'category', label: 'Categoria', type: 'select', options: ['Vacina', 'Medicamento', 'Alimento perecível'] },
        { key: 'minTemp', label: 'Temp Mínima (°C)', type: 'text' },
        { key: 'maxTemp', label: 'Temp Máxima (°C)', type: 'text' },
        { key: 'sensitivity', label: 'Criticidade', type: 'select', options: ['Baixa', 'Média', 'Alta', 'Crítica'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] }
    ]
});

// 8. Rotas
Pages.AdminRoutes = CrudBuilder.build({
    id: 'admin-routes',
    title: 'Gestão de Rotas',
    group: 'Cadastros',
    data: window.adminData.routes,
    columns: [
        { key: 'code', label: 'Código' },
        { key: 'origin', label: 'Origem' },
        { key: 'dest', label: 'Destino' },
        { key: 'asset', label: 'Ativo' },
        { key: 'product', label: 'Produto' },
        { key: 'startExpected', label: 'Início Previsto' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'code', label: 'Código da Operação', type: 'text' },
        { key: 'origin', label: 'Origem', type: 'text' },
        { key: 'dest', label: 'Destino', type: 'text' },
        { key: 'asset', label: 'Ativo', type: 'text' },
        { key: 'product', label: 'Produto', type: 'text' },
        { key: 'startExpected', label: 'Data Início', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Planejada', 'Em andamento', 'Concluída'] }
    ]
});

// 9. Parâmetros
Pages.AdminParameters = CrudBuilder.build({
    id: 'admin-parameters',
    title: 'Parâmetros de Controle',
    group: 'Operação',
    data: window.adminData.parameters,
    columns: [
        { key: 'name', label: 'Regra' },
        { key: 'product', label: 'Produto' },
        { key: 'minTemp', label: 'Min (°C)' },
        { key: 'maxTemp', label: 'Max (°C)' },
        { key: 'tolerance', label: 'Tolerância' },
        { key: 'criticality', label: 'Criticidade' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'name', label: 'Nome da Regra', type: 'text' },
        { key: 'product', label: 'Produto Vinculado', type: 'text' },
        { key: 'minTemp', label: 'Temp Min', type: 'text' },
        { key: 'maxTemp', label: 'Temp Max', type: 'text' },
        { key: 'tolerance', label: 'Tolerância (min)', type: 'text' },
        { key: 'criticality', label: 'Criticidade', type: 'select', options: ['Alta', 'Crítica'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] }
    ]
});

// 10. Alertas
Pages.AdminAlertsConfig = CrudBuilder.build({
    id: 'admin-alerts',
    title: 'Gestão de Alertas e Regras',
    group: 'Operação',
    data: window.adminData.alertsConfig,
    columns: [
        { key: 'name', label: 'Nome do Alerta' },
        { key: 'type', label: 'Tipo' },
        { key: 'condition', label: 'Condição' },
        { key: 'criticality', label: 'Criticidade' },
        { key: 'channels', label: 'Canais' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'name', label: 'Nome do Alerta', type: 'text' },
        { key: 'type', label: 'Tipo', type: 'select', options: ['Temperatura alta', 'Sem comunicação', 'Porta aberta'] },
        { key: 'condition', label: 'Condição (Regra)', type: 'text' },
        { key: 'criticality', label: 'Criticidade', type: 'select', options: ['Média', 'Alta', 'Crítica'] },
        { key: 'channels', label: 'Canais (vírgula)', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] }
    ]
});

// 11. Ocorrências
Pages.AdminOccurrences = CrudBuilder.build({
    id: 'admin-occurrences',
    title: 'Gestão de Ocorrências',
    group: 'Operação',
    data: window.adminData.occurrences,
    columns: [
        { key: 'code', label: 'Código' },
        { key: 'type', label: 'Tipo' },
        { key: 'asset', label: 'Ativo' },
        { key: 'product', label: 'Produto' },
        { key: 'criticality', label: 'Criticidade' },
        { key: 'responsible', label: 'Responsável' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'code', label: 'Código', type: 'text' },
        { key: 'type', label: 'Tipo', type: 'select', options: ['Variação de temperatura', 'Atraso operacional', 'Falha de sensor'] },
        { key: 'asset', label: 'Ativo', type: 'text' },
        { key: 'product', label: 'Produto', type: 'text' },
        { key: 'criticality', label: 'Criticidade', type: 'select', options: ['Média', 'Alta', 'Crítica'] },
        { key: 'responsible', label: 'Responsável', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Aberta', 'Em tratativa', 'Resolvida', 'Cancelada'] }
    ]
});

// 12. Integrações
Pages.AdminIntegrations = CrudBuilder.build({
    id: 'admin-integrations',
    title: 'Integrações',
    group: 'Administração',
    data: window.adminData.integrations,
    columns: [
        { key: 'name', label: 'Integração' },
        { key: 'type', label: 'Tipo' },
        { key: 'system', label: 'Sistema Externo' },
        { key: 'lastSync', label: 'Última Sincronização' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'name', label: 'Nome da Integração', type: 'text' },
        { key: 'type', label: 'Tipo', type: 'select', options: ['API REST', 'Webhook', 'MQTT'] },
        { key: 'system', label: 'Sistema Externo', type: 'text' },
        { key: 'endpoint', label: 'Endpoint / URL', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo'] }
    ]
});

// 13. Auditoria
Pages.AdminAudits = CrudBuilder.build({
    id: 'admin-audits',
    title: 'Auditoria e Logs',
    group: 'Administração',
    data: window.adminData.audits,
    columns: [
        { key: 'date', label: 'Data/Hora' },
        { key: 'user', label: 'Usuário' },
        { key: 'action', label: 'Ação' },
        { key: 'module', label: 'Módulo' },
        { key: 'record', label: 'Registro Afetado' },
        { key: 'ip', label: 'IP' },
        { key: 'status', label: 'Status' }
    ],
    fields: [
        { key: 'user', label: 'Usuário', type: 'text' },
        { key: 'action', label: 'Ação', type: 'text' },
        { key: 'module', label: 'Módulo', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Sucesso', 'Falha'] }
    ]
});

// 14. Configurações
Pages.AdminSettings = CrudBuilder.build({
    id: 'admin-settings',
    title: 'Configurações Gerais',
    group: 'Administração',
    data: window.adminData.settings,
    columns: [
        { key: 'key', label: 'Parâmetro' },
        { key: 'value', label: 'Valor Configurado' }
    ],
    fields: [
        { key: 'key', label: 'Parâmetro', type: 'text' },
        { key: 'value', label: 'Valor', type: 'text' }
    ]
});
