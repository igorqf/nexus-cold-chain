window.Pages = window.Pages || {};

Pages.Sensors = {
    render: () => `
        ${Components.Sidebar('sensors')}
        <div class="main-content">
            ${Components.Header('Administração de Sensores e Ativos', 'Nexus / Admin / Sensores e Ativos')}
            <div class="page-container" style="padding-top: 16px;">
                
                <div class="flex justify-between items-center mb-4">
                    <div class="flex gap-4">
                        <div class="card" style="padding: 12px 24px; min-width: 150px;">
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Sensores Ativos</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">1.240</div>
                        </div>
                        <div class="card" style="padding: 12px 24px; min-width: 150px;">
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Bateria < 20%</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--status-warning);">45</div>
                        </div>
                        <div class="card" style="padding: 12px 24px; min-width: 150px;">
                            <div style="font-size: 0.8rem; color: var(--text-secondary);">Offline</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--status-offline);">12</div>
                        </div>
                    </div>
                    <button class="btn btn-primary"><i data-lucide="plus"></i> Cadastrar Sensor</button>
                </div>

                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <div class="flex gap-2">
                            <select class="btn btn-secondary">
                                <option>Todos os Tipos</option>
                                <option>Temperatura</option>
                                <option>Umidade</option>
                                <option>Abertura de Porta</option>
                            </select>
                            <input type="text" class="btn btn-secondary" style="background: white; text-align: left; cursor: text;" placeholder="Buscar ID do Sensor...">
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Sensor</th>
                                    <th>Tipo</th>
                                    <th>Ativo Vinculado</th>
                                    <th>Localização</th>
                                    <th>Bateria</th>
                                    <th>Última Comunicação</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="font-family: monospace; font-weight: 600;">IOT-TEMP-009182</td>
                                    <td>Temperatura/Umidade</td>
                                    <td>Veículo NEX-4821</td>
                                    <td>Em trânsito</td>
                                    <td><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 40px; height: 6px; background: #E2E8F0; border-radius: 3px;"><div style="width: 85%; height: 100%; background: var(--status-normal); border-radius: 3px;"></div></div> 85%</div></td>
                                    <td>Há 2 min</td>
                                    <td>${Components.Badge('normal', 'Online')}</td>
                                    <td><button class="btn btn-secondary" style="padding: 4px 8px;"><i data-lucide="edit" size="14"></i></button></td>
                                </tr>
                                <tr>
                                    <td style="font-family: monospace; font-weight: 600;">IOT-TEMP-009184</td>
                                    <td>Temperatura/Umidade</td>
                                    <td>Veículo NEX-1029</td>
                                    <td>Em trânsito</td>
                                    <td><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 40px; height: 6px; background: #E2E8F0; border-radius: 3px;"><div style="width: 15%; height: 100%; background: var(--status-critical); border-radius: 3px;"></div></div> 15%</div></td>
                                    <td>Há 5 min</td>
                                    <td>${Components.Badge('warning', 'Bateria Baixa')}</td>
                                    <td><button class="btn btn-secondary" style="padding: 4px 8px;"><i data-lucide="edit" size="14"></i></button></td>
                                </tr>
                                <tr>
                                    <td style="font-family: monospace; font-weight: 600;">IOT-DOOR-00441</td>
                                    <td>Abertura de Porta</td>
                                    <td>Câmara Fria CD-SP-02</td>
                                    <td>CD São Paulo</td>
                                    <td><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 40px; height: 6px; background: #E2E8F0; border-radius: 3px;"><div style="width: 95%; height: 100%; background: var(--status-normal); border-radius: 3px;"></div></div> 95%</div></td>
                                    <td>Há 45 min</td>
                                    <td>${Components.Badge('offline', 'Offline')}</td>
                                    <td><button class="btn btn-secondary" style="padding: 4px 8px;"><i data-lucide="edit" size="14"></i></button></td>
                                </tr>
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
