window.Pages = window.Pages || {};

Pages.Maintenance = {
    render: () => `
        ${Components.Sidebar('maintenance')}
        <div class="main-content">
            ${Components.Header('Manutenção Proativa (IA)', 'Nexus / Manutenção / Ordens de Serviço')}
            <div class="page-container" style="padding-top: 16px;">
                
                <div class="kpi-grid">
                    <div class="card kpi-card">
                        <div class="kpi-header">Preventivas Abertas</div>
                        <div class="kpi-value">18</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Emergenciais Evitadas</div>
                        <div class="kpi-value text-normal">4</div>
                        <div class="kpi-trend trend-down">Mês atual</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Ativos Críticos</div>
                        <div class="kpi-value text-critical">2</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Economia Estimada</div>
                        <div class="kpi-value text-normal">R$ 14.5k</div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-8 card">
                        <h3 class="mb-4">Backlog de Ordens de Serviço (Geradas por IA)</h3>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>OS</th>
                                        <th>Ativo</th>
                                        <th>Componente</th>
                                        <th>Prob. Falha</th>
                                        <th>Janela Recomendada</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${mockData.maintenanceOrders.map(os => `
                                        <tr>
                                            <td>${os.id}</td>
                                            <td style="font-weight: 500;">${os.asset}</td>
                                            <td>${os.component}</td>
                                            <td><span class="${parseInt(os.failureProb) > 70 ? 'text-critical' : 'text-warning'} font-bold">${os.failureProb}</span></td>
                                            <td>${os.window}</td>
                                            <td>${Components.Badge(os.status === 'Agendada' ? 'analysis' : 'warning', os.status)}</td>
                                            <td><button class="btn btn-secondary" style="padding: 4px 8px;">Detalhe</button></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="col-span-4 card" style="background-color: var(--primary-color); color: white;">
                        <h3 style="margin-bottom: 16px; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="zap" class="text-warning"></i> Insights de Manutenção
                        </h3>
                        <p style="font-size: 0.9rem; margin-bottom: 16px; color: #CBD5E1;">A Inteligência Artificial analisou 4.500 horas de telemetria na última semana.</p>
                        
                        <div style="background-color: rgba(255,255,255,0.1); padding: 12px; border-radius: var(--border-radius-md); margin-bottom: 12px;">
                            <div style="font-weight: 600; font-size: 0.9rem;">Compressor R-402 (NEX-4821)</div>
                            <div style="font-size: 0.8rem; color: #CBD5E1;">Vibração anômala e aumento de corrente (22A > 28A). Sugere troca de rolamento antes da quebra do eixo.</div>
                        </div>
                        
                        <div style="background-color: rgba(255,255,255,0.1); padding: 12px; border-radius: var(--border-radius-md);">
                            <div style="font-weight: 600; font-size: 0.9rem;">Câmara 03 (CD RJ)</div>
                            <div style="font-size: 0.8rem; color: #CBD5E1;">Ciclos de degelo 30% mais curtos que o histórico. Sugere inspeção nos sensores de temperatura da serpentina.</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
    afterRender: () => {
        lucide.createIcons();
    }
};
