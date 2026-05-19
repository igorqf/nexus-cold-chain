window.Pages = window.Pages || {};

Pages.Rules = {
    render: () => `
        ${Components.Sidebar('rules')}
        <div class="main-content">
            ${Components.Header('Configuração de Regras e Parâmetros', 'Nexus / Admin / Regras Operacionais')}
            <div class="page-container" style="padding-top: 16px;">
                
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-3">
                        <div class="card" style="padding: 0;">
                            <div style="padding: 16px; border-bottom: 1px solid var(--border-color); font-weight: 600;">Categorias</div>
                            <ul style="list-style: none;">
                                <li style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); cursor: pointer; background: var(--bg-color); border-left: 3px solid var(--accent-color);">Faixas de Temperatura</li>
                                <li style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); cursor: pointer;">Regras de IA e Severidade</li>
                                <li style="padding: 12px 16px; border-bottom: 1px solid var(--border-color); cursor: pointer;">Notificações e Alçadas</li>
                                <li style="padding: 12px 16px; cursor: pointer;">SLA de Manutenção</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="col-span-9">
                        <div class="card">
                            <div class="flex justify-between items-center mb-4">
                                <h3 style="font-size: 1.1rem;">Faixas de Temperatura por Produto</h3>
                                <button class="btn btn-primary" style="padding: 6px 12px;"><i data-lucide="plus" size="16"></i> Nova Regra</button>
                            </div>

                            <div class="table-container mb-4">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Categoria / Produto</th>
                                            <th>Faixa Ideal</th>
                                            <th>Tolerância (Tempo)</th>
                                            <th>Ação Automática (Excursão)</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="font-weight: 500;">Vacinas Termossensíveis</td>
                                            <td>2°C a 8°C</td>
                                            <td>Máx 5 min</td>
                                            <td>Alerta Crítico + Bloqueio Lote</td>
                                            <td><span class="badge badge-normal">Ativo</span></td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 500;">Hemoderivados</td>
                                            <td>2°C a 6°C</td>
                                            <td>Zero (Imediato)</td>
                                            <td>Alerta Crítico + Notificar Diretoria</td>
                                            <td><span class="badge badge-normal">Ativo</span></td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: 500;">Alimentos Perecíveis (Carnes)</td>
                                            <td>-18°C a -10°C</td>
                                            <td>Máx 30 min</td>
                                            <td>Alerta Atenção</td>
                                            <td><span class="badge badge-normal">Ativo</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style="background-color: var(--bg-color); padding: 16px; border-radius: var(--border-radius-md); border: 1px dashed var(--border-color);">
                                <div style="font-weight: 600; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="play-circle" class="text-muted"></i> Simulador de Regra
                                </div>
                                <div class="grid grid-cols-4 gap-4">
                                    <select class="btn btn-secondary w-full" style="text-align: left;"><option>Vacinas Termossensíveis</option></select>
                                    <input type="text" class="btn btn-secondary w-full" style="background: white; cursor: text;" placeholder="Simular Temp. (Ex: 9.5)">
                                    <input type="text" class="btn btn-secondary w-full" style="background: white; cursor: text;" placeholder="Simular Tempo (Ex: 10m)">
                                    <button class="btn btn-secondary" style="background-color: var(--primary-color); color: white;">Testar Gatilho</button>
                                </div>
                            </div>
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
