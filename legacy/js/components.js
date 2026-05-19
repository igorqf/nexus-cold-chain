// Reusable UI Components

const Components = {
    Sidebar: (activePage) => {
        const isCadastroOpen = ['admin-companies', 'admin-bases', 'admin-users', 'admin-roles', 'admin-assets', 'admin-sensors', 'admin-products', 'admin-routes'].includes(activePage);
        const isAdminOpen = ['admin-integrations', 'admin-audits', 'admin-settings'].includes(activePage);

        return `
        <aside class="sidebar">
            <div class="sidebar-header">
                <i data-lucide="snowflake" class="brand-icon"></i>
                <h1>Cold Chain<br>Intelligence</h1>
            </div>
            <ul class="nav-links">
                <!-- Old items -->
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" onclick="app.navigate('dashboard')">
                        <i data-lucide="layout-dashboard"></i>
                        Torre de Controle
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'alerts' || activePage === 'admin-alerts' ? 'active' : ''}" onclick="app.navigate('alerts')">
                        <i data-lucide="bell-ring"></i>
                        Alertas e Anomalias
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'maintenance' ? 'active' : ''}" onclick="app.navigate('maintenance')">
                        <i data-lucide="wrench"></i>
                        Manutenção Proativa
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'traceability' ? 'active' : ''}" onclick="app.navigate('traceability')">
                        <i data-lucide="route"></i>
                        Rastreabilidade
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'executive' ? 'active' : ''}" onclick="app.navigate('executive')">
                        <i data-lucide="bar-chart-3"></i>
                        Visão Executiva
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'sensors' ? 'active' : ''}" onclick="app.navigate('sensors')">
                        <i data-lucide="cpu"></i>
                        Sensores e Ativos
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'rules' || activePage === 'admin-parameters' ? 'active' : ''}" onclick="app.navigate('rules')">
                        <i data-lucide="settings-2"></i>
                        Regras de Operação
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link ${activePage === 'reports' ? 'active' : ''}" onclick="app.navigate('reports')">
                        <i data-lucide="file-text"></i>
                        Relatórios
                    </a>
                </li>

                <!-- Cadastros Toggle -->
                <details class="nav-group" ${isCadastroOpen ? 'open' : ''}>
                    <summary class="nav-link" style="justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="folder-plus"></i>
                            <span>Cadastros</span>
                        </div>
                        <i data-lucide="chevron-down" size="16"></i>
                    </summary>
                    <div class="nav-group-content">
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-companies' ? 'active' : ''}" onclick="app.navigate('admin-companies')">Empresas</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-bases' ? 'active' : ''}" onclick="app.navigate('admin-bases')">Bases Operacionais</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-users' ? 'active' : ''}" onclick="app.navigate('admin-users')">Usuários</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-roles' ? 'active' : ''}" onclick="app.navigate('admin-roles')">Perfis e Permissões</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-assets' ? 'active' : ''}" onclick="app.navigate('admin-assets')">Ativos</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-sensors' ? 'active' : ''}" onclick="app.navigate('admin-sensors')">Sensores / Dispositivos</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-products' ? 'active' : ''}" onclick="app.navigate('admin-products')">Produtos</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-routes' ? 'active' : ''}" onclick="app.navigate('admin-routes')">Rotas</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-occurrences' ? 'active' : ''}" onclick="app.navigate('admin-occurrences')">Ocorrências</a></li>
                    </div>
                </details>

                <!-- Administração Toggle -->
                <details class="nav-group" ${isAdminOpen ? 'open' : ''}>
                    <summary class="nav-link" style="justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="settings"></i>
                            <span>Administração</span>
                        </div>
                        <i data-lucide="chevron-down" size="16"></i>
                    </summary>
                    <div class="nav-group-content">
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-integrations' ? 'active' : ''}" onclick="app.navigate('admin-integrations')">Integrações</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-audits' ? 'active' : ''}" onclick="app.navigate('admin-audits')">Auditoria</a></li>
                        <li class="nav-item"><a href="#" class="nav-link ${activePage === 'admin-settings' ? 'active' : ''}" onclick="app.navigate('admin-settings')">Configurações</a></li>
                    </div>
                </details>
            </ul>
            <div class="sidebar-footer" onclick="app.navigate('login')">
                <div class="user-info">
                    <div class="user-name">Igor Admin</div>
                    <div class="user-role">Diretoria</div>
                </div>
                <i data-lucide="log-out"></i>
            </div>
        </aside>
        `;
    },

    Header: (title, breadcrumbs) => `
        <header class="top-header">
            <div class="search-bar">
                <i data-lucide="search" size="18" class="text-muted"></i>
                <input type="text" placeholder="Buscar veículo, carga, alerta...">
            </div>
            <div class="header-actions">
                <div class="action-icon" onclick="app.showModal()">
                    <i data-lucide="bell"></i>
                    <span class="notification-badge">3</span>
                </div>
                <div class="action-icon">
                    <i data-lucide="help-circle"></i>
                </div>
                <div class="action-icon">
                    <i data-lucide="settings"></i>
                </div>
            </div>
        </header>
        <div style="padding: 32px 32px 0 32px;">
            <div class="breadcrumbs">${breadcrumbs}</div>
            <h2 class="page-title">${title}</h2>
        </div>
    `,

    Badge: (status, text) => {
        let badgeClass = 'badge-normal';
        if (status === 'warning') badgeClass = 'badge-warning';
        if (status === 'critical') badgeClass = 'badge-critical';
        if (status === 'offline') badgeClass = 'badge-offline';
        
        return `<span class="badge ${badgeClass}">${text}</span>`;
    },

    AlertModal: () => {
        // Build rows from mockData.alerts (using only open/unresolved ones)
        const openAlerts = mockData.alerts.filter(a => a.status !== 'Resolvido');
        const rows = openAlerts.map(a => `
            <tr style="transition: opacity 0.3s;">
                <td>
                    <div style="font-weight: 600;">${a.type}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${a.source}</div>
                </td>
                <td>
                    <div style="font-size: 0.85rem;">${a.date}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">Risco IA: <span style="color: ${parseInt(a.failureProb) > 70 ? 'var(--status-critical)' : 'var(--status-warning)'}; font-weight: bold;">${a.failureProb}</span></div>
                </td>
                <td>${Components.Badge(a.severity === 'Crítico' ? 'critical' : 'warning', a.severity)}</td>
                <td style="text-align: right;">
                    <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.8rem;" onclick="app.markAlertAsRead(this)">
                        <i data-lucide="check" size="14"></i> Confirmar Leitura
                    </button>
                </td>
            </tr>
        `).join('');

        return `
            <div class="modal-overlay" onclick="if(event.target === this) app.closeModal()">
                <div class="modal" style="max-width: 650px;">
                    <div class="modal-header">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="bell-ring" style="color: var(--status-critical);"></i>
                            <h2 style="font-size: 1.2rem; margin: 0;">Central de Notificações</h2>
                        </div>
                        <button class="btn btn-secondary" style="padding: 4px; border: none;" onclick="app.closeModal()">
                            <i data-lucide="x" size="20"></i>
                        </button>
                    </div>
                    <div class="modal-body" style="padding: 0;">
                        <div class="table-container" style="max-height: 400px; overflow-y: auto;">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Alerta / Origem</th>
                                        <th>Data / IA</th>
                                        <th>Severidade</th>
                                        <th style="text-align: right;">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows}
                                    ${openAlerts.length === 0 ? '<tr><td colspan="4" style="text-align: center; padding: 24px; color: var(--text-secondary);">Nenhum alerta pendente.</td></tr>' : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer" style="background-color: var(--bg-color); border-bottom-left-radius: var(--border-radius-lg); border-bottom-right-radius: var(--border-radius-lg);">
                        <button class="btn btn-secondary" onclick="app.navigate('alerts'); app.closeModal();">Ver Histórico Completo</button>
                    </div>
                </div>
            </div>
        `;
    }
};
