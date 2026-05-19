window.Pages = window.Pages || {};

Pages.VehicleDetail = {
    render: (vehicleId) => {
        // Find vehicle or fallback to first
        const v = mockData.vehicles.find(v => v.id === vehicleId) || mockData.vehicles[0];
        
        return `
            ${Components.Sidebar('dashboard')}
            <div class="main-content">
                ${Components.Header(`Detalhes do Veículo: ${v.plate}`, 'Nexus / Operação / Torre de Controle / Detalhe')}
                
                <div class="page-container" style="padding-top: 16px;">
                    <!-- Cabecalho da Viagem -->
                    <div class="card mb-4" style="border-left: 4px solid ${v.status === 'normal' ? 'var(--status-normal)' : v.status === 'warning' ? 'var(--status-warning)' : 'var(--status-critical)'}">
                        <div class="grid grid-cols-12 gap-4 items-center">
                            <div class="col-span-3">
                                <div class="text-muted" style="font-size: 0.8rem;">Motorista</div>
                                <div style="font-weight: 600;">${v.driver}</div>
                            </div>
                            <div class="col-span-3">
                                <div class="text-muted" style="font-size: 0.8rem;">Rota</div>
                                <div style="font-weight: 600;">${v.route}</div>
                            </div>
                            <div class="col-span-3">
                                <div class="text-muted" style="font-size: 0.8rem;">Cliente / Produto</div>
                                <div style="font-weight: 600;">${v.customer}</div>
                                <div style="font-size: 0.8rem;">${v.product}</div>
                            </div>
                            <div class="col-span-3" style="text-align: right;">
                                ${Components.Badge(v.status, v.status.toUpperCase())}
                                <div class="mt-4 gap-2 flex" style="justify-content: flex-end;">
                                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem;"><i data-lucide="phone" size="14"></i> Motorista</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sensor Cards -->
                    <div class="kpi-grid mb-4">
                        <div class="card kpi-card">
                            <div class="kpi-header">Temp. Atual <i data-lucide="thermometer"></i></div>
                            <div class="kpi-value ${v.currentTemp < v.safeRange.min || v.currentTemp > v.safeRange.max ? 'text-critical' : 'text-normal'}">${v.currentTemp}°C</div>
                            <div class="kpi-trend trend-neutral">Faixa: ${v.safeRange.min}° a ${v.safeRange.max}°C</div>
                        </div>
                        <div class="card kpi-card">
                            <div class="kpi-header">Risco de Falha IA <i data-lucide="brain"></i></div>
                            <div class="kpi-value ${v.failureRisk > 70 ? 'text-critical' : v.failureRisk > 40 ? 'text-warning' : 'text-normal'}">${v.failureRisk}%</div>
                            <div class="kpi-trend trend-up">Atualizado: ${v.lastComm}</div>
                        </div>
                        <div class="card kpi-card">
                            <div class="kpi-header">Compressor <i data-lucide="fan"></i></div>
                            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; color: ${v.compressorStatus !== 'Operacional' ? 'var(--status-critical)' : 'var(--text-primary)'}">${v.compressorStatus}</div>
                            <div class="kpi-trend trend-neutral">Bateria Sensor: ${v.battery}</div>
                        </div>
                        <div class="card kpi-card">
                            <div class="kpi-header">Previsão Chegada <i data-lucide="clock"></i></div>
                            <div class="kpi-value">${v.eta}</div>
                            <div class="kpi-trend trend-neutral">Umidade: ${v.humidity}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <!-- Chart -->
                        <div class="col-span-8 card">
                            <h3 style="margin-bottom: 16px; font-size: 1rem;">Evolução de Temperatura</h3>
                            <canvas id="tempChart" height="250"></canvas>
                        </div>
                        
                        <!-- Timeline -->
                        <div class="col-span-4 card">
                            <h3 style="margin-bottom: 16px; font-size: 1rem;">Timeline da Viagem</h3>
                            <div class="timeline">
                                <div class="timeline-item">
                                    <div class="timeline-content">
                                        <div class="timeline-time">08:00</div>
                                        <div style="font-weight: 600;">Partida do CD</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Temp inicial: 4.0°C</div>
                                    </div>
                                </div>
                                <div class="timeline-item">
                                    <div class="timeline-content">
                                        <div class="timeline-time">10:30</div>
                                        <div style="font-weight: 600;">Abertura de Porta</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">Entrega em rota. Duração: 12 min.</div>
                                    </div>
                                </div>
                                <div class="timeline-item ${v.status !== 'normal' ? 'critical' : ''}">
                                    <div class="timeline-content">
                                        <div class="timeline-time">13:15</div>
                                        <div style="font-weight: 600; color: ${v.status !== 'normal' ? 'var(--status-critical)' : 'var(--text-primary)'}">${v.status !== 'normal' ? 'Alerta Predição' : 'Operação Normal'}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${v.status !== 'normal' ? 'Anomalia no padrão de resfriamento detectada.' : 'Temperatura estável.'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- IA Analysis Block -->
                    ${v.failureRisk > 40 ? `
                        <div class="card mt-4" style="background-color: #FFF1F2; border-color: #FECDD3;">
                            <h3 style="margin-bottom: 12px; font-size: 1rem; color: #9F1239; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="cpu"></i> Análise de Anomalia IA
                            </h3>
                            <div class="grid grid-cols-3">
                                <div>
                                    <div style="font-size: 0.8rem; color: #9F1239;">Tipo de Anomalia</div>
                                    <div style="font-weight: 600;">Degradação do ciclo de refrigeração</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.8rem; color: #9F1239;">Impacto Estimado</div>
                                    <div style="font-weight: 600;">Excursão de temp. em 45 min</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.8rem; color: #9F1239;">Recomendação Automática</div>
                                    <div style="font-weight: 600;">Direcionar para manutenção emergencial</div>
                                </div>
                            </div>
                            <div class="mt-4 flex gap-4">
                                <button class="btn btn-danger">Abrir Ocorrência</button>
                                <button class="btn btn-secondary" style="border-color: #FECDD3; color: #9F1239;" onclick="app.navigate('maintenance')">Acionar Manutenção</button>
                            </div>
                        </div>
                    ` : ''}

                </div>
            </div>
        `;
    },
    afterRender: (vehicleId) => {
        lucide.createIcons();
        const v = mockData.vehicles.find(v => v.id === vehicleId) || mockData.vehicles[0];

        // Chart.js
        const ctx = document.getElementById('tempChart');
        if (ctx) {
            // Generate dummy data points
            const dataPoints = Array.from({length: 12}, (_, i) => {
                let temp = 4.0 + (Math.random() * 1.5 - 0.75); // base 4.0 +/- 0.75
                if (v.status === 'critical' && i > 8) temp += 4; // spike
                return temp;
            });

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'],
                    datasets: [{
                        label: 'Temperatura °C',
                        data: dataPoints,
                        borderColor: 'var(--accent-color)',
                        backgroundColor: 'rgba(13, 148, 136, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        annotation: {
                            annotations: {
                                box1: {
                                    type: 'box',
                                    yMin: v.safeRange.min,
                                    yMax: v.safeRange.max,
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    borderWidth: 0,
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            min: Math.min(v.safeRange.min - 2, Math.min(...dataPoints) - 1),
                            max: Math.max(v.safeRange.max + 2, Math.max(...dataPoints) + 1),
                            grid: { color: 'var(--border-color)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }
};
