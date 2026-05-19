window.Pages = window.Pages || {};

Pages.Dashboard = {
    render: () => `
        ${Components.Sidebar('dashboard')}
        <div class="main-content">
            ${Components.Header('Torre de Controle — Tempo Real', 'Nexus / Operação / Torre de Controle')}
            <div class="page-container" style="padding-top: 16px;">
                
                <!-- KPI Cards -->
                <div class="kpi-grid">
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span>Veículos Monitorados</span>
                            <i data-lucide="truck" class="text-muted"></i>
                        </div>
                        <div class="kpi-value">124</div>
                        <div class="kpi-trend trend-neutral"><i data-lucide="minus" size="14"></i> Estável</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span>Temp. Média Operação</span>
                            <i data-lucide="thermometer" class="text-muted"></i>
                        </div>
                        <div class="kpi-value">4.2°C</div>
                        <div class="kpi-trend trend-down"><i data-lucide="arrow-down-right" size="14"></i> Dentro da meta</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span>Alertas Ativos</span>
                            <i data-lucide="alert-triangle" class="text-muted"></i>
                        </div>
                        <div class="kpi-value">3</div>
                        <div class="kpi-trend trend-up"><i data-lucide="arrow-up-right" size="14"></i> +2 desde ontem</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">
                            <span>Risco Falha 7 Dias</span>
                            <i data-lucide="activity" class="text-muted"></i>
                        </div>
                        <div class="kpi-value">8%</div>
                        <div class="kpi-trend trend-down"><i data-lucide="arrow-down-right" size="14"></i> -3% com preditiva</div>
                    </div>
                </div>

                <!-- Main Layout -->
                <div class="dashboard-grid">
                    <!-- Map Area -->
                    <div class="card map-card" style="padding: 0; overflow: hidden;">
                        <div style="padding: 16px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="font-size: 1rem;">Visão Geográfica</h3>
                            <div class="flex gap-2">
                                <span class="badge badge-critical">1 Crítico</span>
                                <span class="badge badge-warning">2 Atenção</span>
                                <span class="badge badge-normal">118 Normais</span>
                            </div>
                        </div>
                        <div id="map"></div>
                    </div>

                    <!-- Side List -->
                    <div class="card side-list-card" style="padding: 0;">
                        <div style="padding: 16px; border-bottom: 1px solid var(--border-color);">
                            <h3 style="font-size: 1rem;">Veículos em Rota</h3>
                        </div>
                        <div class="list-content">
                            ${mockData.vehicles.map(v => `
                                <div class="vehicle-list-item" onclick="app.navigate('vehicle-detail', '${v.id}')">
                                    <div class="header">
                                        <span class="plate">${v.plate}</span>
                                        ${Components.Badge(v.status, v.status === 'normal' ? 'Normal' : v.status === 'warning' ? 'Atenção' : v.status === 'critical' ? 'Crítico' : 'Offline')}
                                    </div>
                                    <div class="details" style="margin-bottom: 4px;">
                                        <span>${v.customer}</span>
                                        <span style="font-weight: 600; color: var(--text-primary);">${v.currentTemp}°C</span>
                                    </div>
                                    <div class="details">
                                        <span>Risco IA: <span class="${v.failureRisk > 70 ? 'text-critical' : v.failureRisk > 40 ? 'text-warning' : 'text-normal'}">${v.failureRisk}%</span></span>
                                        <span>ETA: ${v.eta}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
    afterRender: () => {
        lucide.createIcons();
        
        // Initialize Map
        setTimeout(() => {
            const map = L.map('map').setView([-23.5505, -46.6333], 6); // SP Focus
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            // Add markers
            mockData.vehicles.forEach(v => {
                let color = '#10B981'; // normal
                if (v.status === 'warning') color = '#F59E0B';
                if (v.status === 'critical') color = '#EF4444';
                if (v.status === 'offline') color = '#94A3B8';

                const markerHtml = `
                    <div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>
                `;
                
                const icon = L.divIcon({ html: markerHtml, className: 'custom-icon' });
                
                L.marker([v.lat, v.lng], { icon })
                 .addTo(map)
                 .bindPopup(`<b>${v.plate}</b><br>Temp: ${v.currentTemp}°C<br>Status: ${v.status.toUpperCase()}`);
            });
        }, 100);
    }
};
