window.Pages = window.Pages || {};

Pages.Alerts = {
    render: () => `
        ${Components.Sidebar('alerts')}
        <div class="main-content">
            ${Components.Header('Gestão de Alertas e Anomalias', 'Nexus / Qualidade / Alertas')}
            <div class="page-container" style="padding-top: 16px;">
                
                <!-- Resumo -->
                <div class="kpi-grid">
                    <div class="card kpi-card">
                        <div class="kpi-header">Alertas Críticos (Hoje)</div>
                        <div class="kpi-value text-critical">12</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Alertas Tratados</div>
                        <div class="kpi-value text-normal">45</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Tempo Médio Resposta</div>
                        <div class="kpi-value">14 min</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Predições de Falha IA</div>
                        <div class="kpi-value text-warning">8</div>
                    </div>
                </div>

                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <h3 style="font-size: 1.1rem;">Fila de Eventos</h3>
                        <div class="flex gap-2">
                            <select class="btn btn-secondary">
                                <option>Severidade</option>
                                <option>Crítico</option>
                                <option>Atenção</option>
                            </select>
                            <select class="btn btn-secondary">
                                <option>Status</option>
                                <option>Aberto</option>
                                <option>Resolvido</option>
                            </select>
                            <button class="btn btn-primary"><i data-lucide="filter" size="16"></i> Filtrar</button>
                        </div>
                    </div>

                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data / Hora</th>
                                    <th>Origem</th>
                                    <th>Tipo de Evento</th>
                                    <th>Severidade</th>
                                    <th>Prob. Falha IA</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${mockData.alerts.map(a => `
                                    <tr>
                                        <td>${a.date}</td>
                                        <td style="font-weight: 500;">${a.source}</td>
                                        <td>${a.type}</td>
                                        <td>${Components.Badge(a.severity === 'Crítico' ? 'critical' : 'warning', a.severity)}</td>
                                        <td><span class="${parseInt(a.failureProb) > 70 ? 'text-critical' : 'text-warning'} font-bold">${a.failureProb}</span></td>
                                        <td>${Components.Badge(a.status === 'Resolvido' ? 'normal' : a.status === 'Em análise' ? 'analysis' : 'warning', a.status)}</td>
                                        <td>
                                            <button class="btn btn-secondary" style="padding: 4px 8px;" onclick="alert('Abrindo detalhes do evento ${a.id}')">Tratar</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    afterRender: () => {
        lucide.createIcons();
    }
};
