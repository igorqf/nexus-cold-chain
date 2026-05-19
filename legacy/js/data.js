// Mock Data para a Plataforma Nexus Cold Chain Intelligence

const mockData = {
    vehicles: [
        {
            id: 'V001',
            plate: 'NEX-4821',
            driver: 'João Silva',
            route: 'CD São Paulo → Campinas',
            customer: 'Hospital São Lucas',
            product: 'Vacinas termossensíveis',
            status: 'warning', // normal, warning, critical, offline
            currentTemp: 4.6,
            safeRange: { min: 2.0, max: 8.0 },
            failureRisk: 78,
            eta: '14:30',
            lat: -23.111,
            lng: -46.555,
            sensorId: 'IOT-TEMP-009182',
            compressorStatus: 'Degradação detectada',
            humidity: '45%',
            battery: '85%',
            lastComm: 'Há 2 min'
        },
        {
            id: 'V002',
            plate: 'NEX-5932',
            driver: 'Carlos Mendes',
            route: 'CD Rio de Janeiro → Niterói',
            customer: 'Rede D\'Or',
            product: 'Hemoderivados',
            status: 'normal',
            currentTemp: 3.2,
            safeRange: { min: 2.0, max: 6.0 },
            failureRisk: 12,
            eta: '15:45',
            lat: -22.880,
            lng: -43.100,
            sensorId: 'IOT-TEMP-009183',
            compressorStatus: 'Operacional',
            humidity: '50%',
            battery: '92%',
            lastComm: 'Há 1 min'
        },
        {
            id: 'V003',
            plate: 'NEX-1029',
            driver: 'Roberto Alves',
            route: 'CD Curitiba → Joinville',
            customer: 'Distribuidora Sul',
            product: 'Alimentos Perecíveis (Carnes)',
            status: 'critical',
            currentTemp: -1.5,
            safeRange: { min: -18.0, max: -10.0 },
            failureRisk: 95,
            eta: '18:00',
            lat: -25.800,
            lng: -49.000,
            sensorId: 'IOT-TEMP-009184',
            compressorStatus: 'Falha intermitente',
            humidity: '60%',
            battery: '40%',
            lastComm: 'Há 5 min'
        },
        {
            id: 'V004',
            plate: 'NEX-3384',
            driver: 'Marcos Paulo',
            route: 'CD Belo Horizonte → Contagem',
            customer: 'Drogaria Araújo',
            product: 'Insulina',
            status: 'offline',
            currentTemp: 5.1,
            safeRange: { min: 2.0, max: 8.0 },
            failureRisk: 30,
            eta: '12:15',
            lat: -19.920,
            lng: -44.020,
            sensorId: 'IOT-TEMP-009185',
            compressorStatus: 'Desconhecido',
            humidity: '--',
            battery: '15%',
            lastComm: 'Há 45 min'
        }
    ],
    
    alerts: [
        {
            id: 'A1001',
            date: '2026-05-18 14:15',
            source: 'Veículo NEX-1029',
            type: 'Temperatura (Excursão)',
            severity: 'Crítico',
            failureProb: '95%',
            timeOutRange: '15 min',
            responsible: 'Operação Sul',
            status: 'Aberto'
        },
        {
            id: 'A1002',
            date: '2026-05-18 13:40',
            source: 'Veículo NEX-4821',
            type: 'Compressor (Degradação)',
            severity: 'Atenção',
            failureProb: '78%',
            timeOutRange: '-',
            responsible: 'Manutenção SP',
            status: 'Em análise'
        },
        {
            id: 'A1003',
            date: '2026-05-18 12:00',
            source: 'Câmara Fria CD-SP-02',
            type: 'Porta Aberta > 5min',
            severity: 'Atenção',
            failureProb: '10%',
            timeOutRange: '-',
            responsible: 'Armazém SP',
            status: 'Resolvido'
        }
    ],

    maintenanceOrders: [
        {
            id: 'OS-2026-089',
            asset: 'Baú R-402 (NEX-4821)',
            location: 'Em trânsito (SP)',
            component: 'Compressor Principal',
            failureProb: '78%',
            severity: 'Alta',
            window: 'Próxima parada (Campinas)',
            status: 'Agendada'
        },
        {
            id: 'OS-2026-090',
            asset: 'Câmara Fria 03',
            location: 'CD Rio de Janeiro',
            component: 'Evaporador',
            failureProb: '45%',
            severity: 'Média',
            window: 'Até 25/05/2026',
            status: 'Pendente'
        }
    ]
};
