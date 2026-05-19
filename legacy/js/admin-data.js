// admin-data.js

window.adminData = {
    users: [
        { id: 1, name: "Igor Silva", email: "igor@nexus.com", phone: "11999999999", company: "Nexus Logística", base: "CD Matriz", role: "Administrador Global", status: "Ativo", lastAccess: "2026-05-19 10:00" },
        { id: 2, name: "Ana Souza", email: "ana@cliente.com", phone: "11888888888", company: "Hospital São Lucas", base: "Unidade Central", role: "Gestor de Operação", status: "Ativo", lastAccess: "2026-05-18 15:30" }
    ],
    roles: [
        { id: 1, name: "Administrador Global", desc: "Acesso total ao sistema", usersCount: 5, status: "Ativo" },
        { id: 2, name: "Gestor de Operação", desc: "Acesso a relatórios e monitoramento", usersCount: 12, status: "Ativo" },
        { id: 3, name: "Visualizador", desc: "Apenas leitura", usersCount: 45, status: "Ativo" }
    ],
    companies: [
        { id: 1, legalName: "Nexus Logística S.A.", tradeName: "Nexus", cnpj: "00.000.000/0001-00", segment: "Operador logístico", basesCount: 5, assetsCount: 150, status: "Ativo" },
        { id: 2, legalName: "Hospital São Lucas Ltda", tradeName: "São Lucas", cnpj: "11.111.111/0001-11", segment: "Hospitais", basesCount: 2, assetsCount: 15, status: "Ativo" }
    ],
    bases: [
        { id: 1, name: "CD Matriz", company: "Nexus", type: "Centro de distribuição", city: "São Paulo/SP", responsible: "Carlos", assetsCount: 80, status: "Ativo" },
        { id: 2, name: "Unidade Central", company: "São Lucas", type: "Unidade hospitalar", city: "Campinas/SP", responsible: "Dra. Ana", assetsCount: 10, status: "Ativo" }
    ],
    assets: [
        { id: 1, code: "V001", name: "Baú Refrigerado 01", type: "Veículo refrigerado", company: "Nexus", base: "CD Matriz", status: "Em operação", sensor: "IOT-TEMP-001", lastRead: "2026-05-19 10:45" },
        { id: 2, code: "C001", name: "Câmara Fria Principal", type: "Câmara fria", company: "São Lucas", base: "Unidade Central", status: "Ativo", sensor: "IOT-TEMP-002", lastRead: "2026-05-19 10:45" }
    ],
    sensors: [
        { id: 1, imei: "123456789012345", type: "Sensor de temperatura", asset: "Baú Refrigerado 01", lastComm: "2026-05-19 10:45", battery: "85%", status: "Online" },
        { id: 2, imei: "987654321098765", type: "Sensor de temperatura e umidade", asset: "Câmara Fria Principal", lastComm: "2026-05-19 10:45", battery: "92%", status: "Online" }
    ],
    products: [
        { id: 1, name: "Vacina mRNA", category: "Vacina", minTemp: "-80", maxTemp: "-60", sensitivity: "Crítica", status: "Ativo" },
        { id: 2, name: "Insulina", category: "Medicamento", minTemp: "2", maxTemp: "8", sensitivity: "Alta", status: "Ativo" }
    ],
    routes: [
        { id: 1, code: "RT-2026-001", origin: "CD Matriz", dest: "Unidade Central", company: "São Lucas", asset: "Baú Refrigerado 01", product: "Insulina", status: "Em andamento", startExpected: "2026-05-19 08:00" },
        { id: 2, code: "RT-2026-002", origin: "CD Matriz", dest: "Distribuidora Sul", company: "Nexus", asset: "Baú Refrigerado 02", product: "Vacina mRNA", status: "Planejada", startExpected: "2026-05-20 09:00" }
    ],
    parameters: [
        { id: 1, name: "Regra Vacina mRNA", product: "Vacina mRNA", minTemp: "-80", maxTemp: "-60", tolerance: "2 min", criticality: "Crítica", status: "Ativo" },
        { id: 2, name: "Regra Insulina", product: "Insulina", minTemp: "2", maxTemp: "8", tolerance: "15 min", criticality: "Alta", status: "Ativo" }
    ],
    alertsConfig: [
        { id: 1, name: "Excursão Crítica de Temperatura", type: "Temperatura alta", condition: "> 8°C por 15 min", criticality: "Alta", channels: "E-mail, SMS", status: "Ativo" },
        { id: 2, name: "Perda de Comunicação", type: "Sem comunicação", condition: "> 30 min sem dados", criticality: "Média", channels: "E-mail", status: "Ativo" }
    ],
    occurrences: [
        { id: 1, code: "OC-001", type: "Variação de temperatura", asset: "Baú Refrigerado 01", product: "Insulina", operation: "RT-2026-001", criticality: "Alta", status: "Em tratativa", responsible: "João Silva", date: "2026-05-19 09:30" },
        { id: 2, code: "OC-002", type: "Atraso operacional", asset: "Baú Refrigerado 02", product: "Vacina mRNA", operation: "RT-2026-002", criticality: "Média", status: "Aberta", responsible: "Maria Alves", date: "2026-05-19 10:15" }
    ],
    integrations: [
        { id: 1, name: "ERP SAP", type: "API REST", system: "SAP S/4HANA", status: "Ativo", lastSync: "2026-05-19 10:45" },
        { id: 2, name: "WMS Externo", type: "Webhook", system: "WMS Tracker", status: "Inativo", lastSync: "2026-05-18 23:00" }
    ],
    audits: [
        { id: 1, date: "2026-05-19 10:45", user: "Igor Silva", action: "Login", module: "Autenticação", record: "-", ip: "192.168.1.10", status: "Sucesso" },
        { id: 2, date: "2026-05-19 10:30", user: "Ana Souza", action: "Edição", module: "Ocorrências", record: "OC-001", ip: "203.0.113.45", status: "Sucesso" }
    ],
    settings: [
        { id: 1, key: "Nome do ambiente", value: "Nexus Cold Chain PROD" },
        { id: 2, key: "Fuso horário", value: "América/Sao_Paulo" },
        { id: 3, key: "Unidade de temperatura", value: "Celsius (°C)" }
    ]
};
