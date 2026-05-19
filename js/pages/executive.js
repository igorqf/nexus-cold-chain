window.Pages = window.Pages || {};

Pages.Executive = {
    render: () => `
        ${Components.Sidebar('executive')}
        <div class="main-content">
            ${Components.Header('Dashboard Executivo de ROI e Performance', 'Nexus / Diretoria / Visão Executiva')}
            <div class="page-container" style="padding-top: 16px;">
                
                <div class="card mb-4" style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); color: white;">
                    <div class="grid grid-cols-12 gap-4 items-center">
                        <div class="col-span-8">
                            <h2 style="font-size: 1.5rem; margin-bottom: 8px;">Resumo do Piloto de IA (Mês 3)</h2>
                            <p style="color: #CBD5E1; font-size: 0.95rem;">"A inteligência artificial reduziu os eventos críticos de temperatura em 45%. Foram evitadas perdas estimadas de <strong>R$ 1.2M</strong> em cargas farmacêuticas devido à atuação proativa em 12 compressores com risco de falha eminente. O payback estimado do projeto reduziu para 4 meses."</p>
                        </div>
                        <div class="col-span-4 flex justify-end gap-4">
                            <div style="text-align: right;">
                                <div style="font-size: 0.8rem; color: #94A3B8;">ROI Acumulado</div>
                                <div style="font-size: 2rem; font-weight: 800; color: var(--status-normal);">215%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="kpi-grid">
                    <div class="card kpi-card">
                        <div class="kpi-header">Cargas Preservadas (Valor)</div>
                        <div class="kpi-value text-normal">R$ 1.2M</div>
                        <div class="kpi-trend trend-down">Evitado em sinistros</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Redução de Excursões</div>
                        <div class="kpi-value">45%</div>
                        <div class="kpi-trend trend-down"><i data-lucide="arrow-down"></i> vs Semestre Anterior</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">Economia Manutenção</div>
                        <div class="kpi-value text-normal">R$ 180k</div>
                        <div class="kpi-trend trend-up">Preventiva vs Emergencial</div>
                    </div>
                    <div class="card kpi-card">
                        <div class="kpi-header">SLA Entregas Críticas</div>
                        <div class="kpi-value">99.8%</div>
                        <div class="kpi-trend trend-up"><i data-lucide="arrow-up"></i> +1.2%</div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="card">
                        <h3 style="margin-bottom: 16px; font-size: 1.1rem;">Tendência de Alertas Críticos (Antes vs Depois IA)</h3>
                        <div style="height: 250px;">
                            <canvas id="alertsChart"></canvas>
                        </div>
                    </div>
                    <div class="card">
                        <h3 style="margin-bottom: 16px; font-size: 1.1rem;">Custo de Manutenção (R$)</h3>
                        <div style="height: 250px;">
                            <canvas id="maintenanceChart"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3 style="margin-bottom: 16px; font-size: 1.1rem;"><i data-lucide="rocket" style="display: inline; vertical-align: middle; color: var(--accent-color);"></i> Próximas Fronteiras (Roadmap)</h3>
                    <div class="grid grid-cols-3 gap-4">
                        <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <div style="font-weight: 600; margin-bottom: 8px;">1. Automação de Câmaras de Armazém</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Expandir sensores IoT para 100% dos CDs e integrar atuadores para controle PID via IA.</div>
                        </div>
                        <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <div style="font-weight: 600; margin-bottom: 8px;">2. Scoring de Risco de Rotas</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Cruzar dados de temperatura externa, trânsito e trepidação para sugerir rotas com menor risco para a carga.</div>
                        </div>
                        <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md);">
                            <div style="font-weight: 600; margin-bottom: 8px;">3. Rollout Nacional</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Expandir o piloto de 120 para 850 veículos até Q4 2026.</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
    afterRender: () => {
        lucide.createIcons();

        const ctx1 = document.getElementById('alertsChart');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr (Início IA)', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Alertas Críticos',
                        data: [45, 52, 48, 30, 22, 18],
                        backgroundColor: 'var(--accent-color)',
                        borderRadius: 4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        const ctx2 = document.getElementById('maintenanceChart');
        if (ctx2) {
            new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [
                        {
                            label: 'Custo Emergencial',
                            data: [120000, 135000, 110000, 80000, 45000, 30000],
                            borderColor: 'var(--status-critical)',
                            tension: 0.4
                        },
                        {
                            label: 'Custo Preventivo/Preditivo',
                            data: [30000, 32000, 30000, 45000, 65000, 70000],
                            borderColor: 'var(--status-normal)',
                            tension: 0.4
                        }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }
};
