window.Pages = window.Pages || {};

Pages.Reports = {
    render: () => `
        ${Components.Sidebar('reports')}
        <div class="main-content">
            ${Components.Header('Central de Relatórios', 'Nexus / Qualidade / Relatórios')}
            <div class="page-container" style="padding-top: 16px;">
                
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-4">
                        <div class="card mb-4" style="border-left: 4px solid var(--accent-color); cursor: pointer;">
                            <div class="flex justify-between items-center mb-2">
                                <h3 style="font-size: 1rem;">Relatório de Conformidade ANVISA</h3>
                                <i data-lucide="file-check" class="text-muted"></i>
                            </div>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">Gera evidências completas de rastreabilidade de temperatura ponta a ponta para auditorias.</p>
                        </div>
                        
                        <div class="card mb-4" style="cursor: pointer; border: 1px solid var(--accent-color); background-color: var(--bg-color);">
                            <div class="flex justify-between items-center mb-2">
                                <h3 style="font-size: 1rem;">Relatório de SLA por Cliente</h3>
                                <i data-lucide="users" class="text-muted"></i>
                            </div>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">Indicadores de pontualidade e integridade térmica das entregas por embarcador.</p>
                        </div>

                        <div class="card mb-4" style="cursor: pointer;">
                            <div class="flex justify-between items-center mb-2">
                                <h3 style="font-size: 1rem;">Histórico de Excursões</h3>
                                <i data-lucide="thermometer-snowflake" class="text-muted"></i>
                            </div>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">Lista de todos os eventos onde a temperatura saiu da faixa segura estabelecida.</p>
                        </div>

                        <div class="card mb-4" style="cursor: pointer;">
                            <div class="flex justify-between items-center mb-2">
                                <h3 style="font-size: 1rem;">ROI & Eficiência Preditiva</h3>
                                <i data-lucide="trending-up" class="text-muted"></i>
                            </div>
                            <p style="font-size: 0.85rem; color: var(--text-secondary);">Impacto financeiro da IA na redução de perdas e manutenção emergencial.</p>
                        </div>
                    </div>
                    
                    <div class="col-span-8">
                        <div class="card" style="min-height: 500px; display: flex; flex-direction: column;">
                            <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 16px;">
                                <h2 style="font-size: 1.2rem; margin-bottom: 12px;">Gerar Relatório de SLA por Cliente</h2>
                                
                                <div class="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label style="display: block; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-secondary);">Cliente</label>
                                        <select class="btn btn-secondary w-full" style="text-align: left;">
                                            <option>Hospital São Lucas</option>
                                            <option>Rede D'Or</option>
                                            <option>Todos</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-secondary);">Período</label>
                                        <select class="btn btn-secondary w-full" style="text-align: left;">
                                            <option>Últimos 30 dias</option>
                                            <option>Mês Atual</option>
                                            <option>Personalizado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; font-size: 0.8rem; margin-bottom: 4px; color: var(--text-secondary);">Formato</label>
                                        <select class="btn btn-secondary w-full" style="text-align: left;">
                                            <option>PDF (Visual)</option>
                                            <option>Excel (Dados)</option>
                                            <option>CSV</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="flex gap-2">
                                    <button class="btn btn-primary"><i data-lucide="download"></i> Gerar e Baixar</button>
                                    <button class="btn btn-secondary"><i data-lucide="mail"></i> Agendar Envio</button>
                                </div>
                            </div>

                            <div style="flex: 1; background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center; flex-direction: column; color: var(--text-secondary);">
                                <i data-lucide="file-bar-chart" size="48" style="margin-bottom: 16px; opacity: 0.5;"></i>
                                <p>Preencha os filtros acima para visualizar o relatório.</p>
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
