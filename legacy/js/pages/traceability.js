window.Pages = window.Pages || {};

Pages.Traceability = {
    render: () => `
        ${Components.Sidebar('traceability')}
        <div class="main-content">
            ${Components.Header('Rastreabilidade e Conformidade (ANVISA)', 'Nexus / Qualidade / Rastreabilidade')}
            <div class="page-container" style="padding-top: 16px;">
                
                <div class="card mb-4">
                    <div class="flex gap-4 items-end">
                        <div style="flex: 1;">
                            <label style="display: block; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-secondary);">Buscar Carga, Lote, NF ou Cliente</label>
                            <div class="search-bar" style="width: 100%; border: 1px solid var(--border-color);">
                                <i data-lucide="search" size="18" class="text-muted"></i>
                                <input type="text" placeholder="Ex: Lote V-4458, NF-e 10294" value="NF-e 88402 (Vacinas)">
                            </div>
                        </div>
                        <button class="btn btn-primary">Buscar Histórico</button>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-4">
                    <div class="col-span-9 card">
                        <div class="flex justify-between items-center mb-4">
                            <h3 style="font-size: 1.1rem;">Linha do Tempo Ponta a Ponta</h3>
                            ${Components.Badge('normal', 'Conforme (Sem Ressalvas)')}
                        </div>
                        
                        <div class="flex justify-between" style="position: relative; padding: 20px 0;">
                            <div style="position: absolute; top: 32px; left: 5%; right: 5%; height: 4px; background-color: var(--status-normal); z-index: 1;"></div>
                            
                            <div style="text-align: center; z-index: 2; background: var(--surface-color); padding: 0 10px;">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--status-normal); border: 4px solid white; margin: 0 auto 8px auto;"></div>
                                <div style="font-weight: 600; font-size: 0.9rem;">Coleta Origem</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">15/05 - 08:00<br>Média: 4.5°C</div>
                            </div>
                            <div style="text-align: center; z-index: 2; background: var(--surface-color); padding: 0 10px;">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--status-normal); border: 4px solid white; margin: 0 auto 8px auto;"></div>
                                <div style="font-weight: 600; font-size: 0.9rem;">Armazenagem CD</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">15/05 - 14:00<br>Média: 3.2°C</div>
                            </div>
                            <div style="text-align: center; z-index: 2; background: var(--surface-color); padding: 0 10px;">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--status-normal); border: 4px solid white; margin: 0 auto 8px auto;"></div>
                                <div style="font-weight: 600; font-size: 0.9rem;">Transporte</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">16/05 - 06:00<br>Média: 4.8°C</div>
                            </div>
                            <div style="text-align: center; z-index: 2; background: var(--surface-color); padding: 0 10px;">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--status-normal); border: 4px solid white; margin: 0 auto 8px auto;"></div>
                                <div style="font-weight: 600; font-size: 0.9rem;">Entrega Cliente</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary);">16/05 - 11:30<br>Temp. final: 5.1°C</div>
                            </div>
                        </div>

                        <div class="mt-4" style="height: 200px;">
                            <canvas id="traceChart"></canvas>
                        </div>
                    </div>

                    <div class="col-span-3 card flex flex-col justify-between">
                        <div>
                            <h3 style="font-size: 1.1rem; margin-bottom: 16px;">Evidências</h3>
                            
                            <div class="mb-3">
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">Temperatura Mínima</div>
                                <div style="font-weight: 600;">2.8°C (CD São Paulo)</div>
                            </div>
                            <div class="mb-3">
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">Temperatura Máxima</div>
                                <div style="font-weight: 600;">6.1°C (Em trânsito)</div>
                            </div>
                            <div class="mb-3">
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">Tempo dentro da faixa (2° a 8°)</div>
                                <div style="font-weight: 600; color: var(--status-normal);">100% (27h 30m)</div>
                            </div>
                            <div class="mb-3">
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">Excursões Registradas</div>
                                <div style="font-weight: 600;">0 Eventos</div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2 mt-4">
                            <button class="btn btn-primary" style="justify-content: center;"><i data-lucide="file-check"></i> Gerar Relatório ANVISA</button>
                            <button class="btn btn-secondary" style="justify-content: center;"><i data-lucide="share-2"></i> Compartilhar c/ Cliente</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
    afterRender: () => {
        lucide.createIcons();

        const ctx = document.getElementById('traceChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['08:00', '12:00', '16:00', '20:00', '00:00', '04:00', '08:00', '12:00'],
                    datasets: [{
                        label: 'Temperatura Contínua °C',
                        data: [4.5, 4.2, 3.8, 3.2, 3.1, 4.8, 5.0, 5.1],
                        borderColor: 'var(--status-normal)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { min: 0, max: 10, grid: { color: 'var(--border-color)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    }
};
