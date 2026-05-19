const Pages = window.Pages || {};

Pages.Login = {
    render: () => `
        <div class="login-container">
            <!-- Brand Side (Desktop Only) -->
            <div class="login-brand-side">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                    <div style="background: var(--accent-color); padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="snowflake" size="32" style="color: white;"></i>
                    </div>
                    <div style="line-height: 1.1;">
                        <span style="font-size: 1.8rem; font-weight: 900; letter-spacing: 0.05em;">NEXUS</span><br>
                        <span style="font-size: 0.85rem; color: var(--accent-color); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Logística Vital</span>
                    </div>
                </div>
                <div class="login-brand-content">
                    <h1>Inteligência que preserva vidas.</h1>
                    <p>Plataforma corporativa para monitoramento proativo da cadeia de frio. Rastreabilidade ponta a ponta e prevenção de falhas com IA.</p>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                    &copy; 2026 Nexus Logística Vital
                </div>
            </div>

            <!-- Form Side -->
            <div class="login-form-side">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-mobile-logo" style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px;">
                            <div style="background: var(--accent-color); padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="snowflake" size="28" style="color: white;"></i>
                            </div>
                            <div style="line-height: 1.1; text-align: left;">
                                <span style="font-size: 1.6rem; font-weight: 900; letter-spacing: 0.05em; color: var(--primary-color);">NEXUS</span><br>
                                <span style="font-size: 0.75rem; color: var(--accent-color); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Logística Vital</span>
                            </div>
                        </div>
                        <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 8px;">Acessar Plataforma</h2>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">Insira suas credenciais corporativas</p>
                    </div>
                    
                    <form onsubmit="event.preventDefault(); app.navigate('dashboard');">
                        <div class="form-group">
                            <label>E-mail Corporativo</label>
                            <input type="email" class="form-control" placeholder="nome@nexuslog.com.br" required value="admin@nexuslog.com.br">
                        </div>
                        <div class="form-group">
                            <label>Senha</label>
                            <input type="password" class="form-control" placeholder="••••••••" required value="123456">
                        </div>
                        <div class="form-group">
                            <label>Perfil de Acesso</label>
                            <select class="form-control">
                                <option>Operação</option>
                                <option>Manutenção</option>
                                <option>Qualidade</option>
                                <option>Gestão</option>
                                <option selected>Diretoria</option>
                            </select>
                        </div>
                        
                        <div class="login-options">
                            <label style="display: flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer;">
                                <input type="checkbox" checked> Lembrar-me
                            </label>
                            <a href="#" style="color: var(--accent-color); text-decoration: none; font-weight: 500;">Esqueci a senha</a>
                        </div>
                        
                        <button type="submit" class="btn btn-primary login-btn">Entrar no Sistema</button>
                    </form>
                </div>
            </div>
        </div>
    `,
    afterRender: () => {
        lucide.createIcons();
    }
};
